import React, { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

type ItemList = { path: string; sum: string };
type ItemGet = { path: string; content: string };
type ItemUpsert = ItemGet;

function App() {
  const [selectedOption, setSelectedOption] = useState<string>("Option 1");
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);

  const { sendJsonMessage } = useWebSocket(
    "wss://o1gb5aeep6.execute-api.us-east-1.amazonaws.com/dev/",
    {
      onOpen: () => console.log("ws connection established"),
      onMessage: (event) => {
        const msg = JSON.parse(event.data);

        switch (msg.route) {
          case "storage/sync":
            setOptions((msg.body.list as ItemList[]).map((file) => file.path));
            break;
          case "storage/get":
            setTextAreaValue((msg.body as ItemGet).content);
            break;
          case "storage/upsert":
            const body: ItemUpsert = msg.body;
            if (selectedOption === body.path) setTextAreaValue(body.content);
            break;
          default:
            console.log(msg);
            break;
        }
      },
      //Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: (closeEvent) => true,
    }
  );

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    sendJsonMessage({
      route: "storage/upsert",
      body: {
        path: selectedOption,
        content: event.target.value,
      },
    });
    setTextAreaValue(event.target.value);
  };

  useEffect(() => {
    sendJsonMessage({
      route: "storage/get",
      body: {
        path: selectedOption,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  return (
    <div
      style={{
        width: "500px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
      }}
    >
      <h1>Real Time Notes Editor</h1>
      <select 
      style={{ width: "100%", height: "50px" }}
      id='options' 
      value={selectedOption} 
      onChange={handleOptionChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div style={{ width: "100%", height: "400px" }}>
        <textarea
          id='textArea'
          style={{ width: "100%", height: "100%" }}
          value={textAreaValue}
          onChange={handleTextAreaChange}
          // rows={30} // Adjust the number of rows as needed
          // cols={50} // Adjust the number of columns as needed
        ></textarea>
      </div>
    </div>
  );
}

export default App;
