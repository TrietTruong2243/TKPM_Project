import express from 'express';
import cors from 'cors';
// import webpack from 'webpack';
// import webpackConfig from './webpack.config.cjs';
// import webpackDevMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';
import downloaderRouter from './routes/download.r.js'
import sourceRouter from './routes/sources.r.js';
import categoryRouter from './routes/categories.r.js';
import novelRouter from './routes/novel.r.js';
import chapterRouter from './routes/chapters.r.js';

const app = express();
const port = process.env.PORT || 4000;

// const compiler = webpack(webpackConfig);

// app.use(webpackDevMiddleware(compiler, {
//     publicPath: webpackConfig.output.publicPath,
//     stats: { colors: true },
// }));

// app.use(webpackHotMiddleware(compiler));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/:source/novels/:slug/chapters', chapterRouter);
app.use('/api/:source/novels', novelRouter);
app.use('/api/:source/categories', categoryRouter);
app.use('/api/sources', sourceRouter);
app.use('/api/download',downloaderRouter)
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
