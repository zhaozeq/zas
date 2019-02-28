import dva from '../packages/dva/src/index';

// import './index.css';

// 1. Initialize
const app = dva({
  onError(error) {
    // 处理全局error
  },
});

// 2. Plugins
// app.use({ ...createLoading({ effects: true }) });

// 3. Model
// app.model(require("./models/example").default)

// 4. Router
app.router(require('./router').default);

// // 5. Start

app.start('#root');
