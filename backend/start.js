require('@babel/register')({
  extensions: ['.js', '.ts'],
  ignore: [/node_modules/],
});
require('./src/server.ts');
