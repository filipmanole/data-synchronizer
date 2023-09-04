import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'service',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
    'serverless-dotenv-plugin',
    'serverless-prune-plugin',
  ],
  provider: {
    name: 'aws',
    profile: 'filip-craft',
    region: 'us-east-1',
    runtime: 'nodejs18.x',
    stage: 'dev',
    websocketsApiName: 'data-synch',
    websocketsApiRouteSelectionExpression: '$request.body.route',
    websocketsDescription: 'Data synchronization API',
    // apiGateway: {
    //   minimumCompressionSize: 1024,
    //   shouldStartNameWithService: true,
    // },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      CONNECTION_TABLE: '${self:custom.dynamoDB.connectionTable}',
      FILES_TABLE: '${self:custom.dynamoDB.filesTable}',
      SHARED_STORAGE_BUCKET: '${self:custom.sharedStorageBucket}',
      APIG_ENDPOINT: 'https://${self:custom.apiGatewayId}.execute-api.${self:provider.region}.amazonaws.com/${self:provider.stage}',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'execute-api:ManageConnections',
        ],
        Resource: 'arn:aws:execute-api:*:*:**/@connections/*'
      },
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:DeleteItem',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:Scan',
        ],
        Resource: 'arn:aws:dynamodb:${self:custom.region}:${aws:accountId}:table/${self:custom.dynamoDB.connectionTable}'
      },
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:DeleteItem',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:Scan',
        ],
        Resource: 'arn:aws:dynamodb:${self:custom.region}:${aws:accountId}:table/${self:custom.dynamoDB.filesTable}'
      }
    ]
  },
  functions: {
    connect: {
      handler: 'src/index.connect',
      events: [
        {
          websocket: '$connect',
        }
      ],
    },
    disconnect: {
      handler: 'src/index.disconnect',
      events: [
        {
          websocket: '$disconnect',
        }
      ],
    },
    fallback: {
      handler: 'src/index.fallback',
      events: [
        {
          websocket: '$default',
        }
      ],
    },
    storageGet : {
      handler: 'src/index.storageGet',
      events: [
        {
          websocket: 'storage/get',
        }
      ],
    },
    storageList : {
      handler: 'src/index.storageList',
      events: [
        {
          websocket: 'storage/list',
        }
      ],
    },
    storageRemove : {
      handler: 'src/index.storageRemove',
      events: [
        {
          websocket: 'storage/remove',
        }
      ],
    },
    storageUpsert : {
      handler: 'src/index.storageUpsert',
      events: [
        {
          websocket: 'storage/upsert',
        }
      ],
    },
  },
  package: { 
    individually: true,
    excludeDevDependencies: true,
  },
  custom: {
    region: '${opt:region, self:provider.region}',
    dynamoDB: {
      connectionTable: 'websocket-connections-table',
      filesTable: 'files-table',
    },
    sharedStorageBucket: 'shared-files-storage',
    apiGatewayId: 'o1gb5aeep6',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources:{
    
  }
};

module.exports = serverlessConfiguration;
