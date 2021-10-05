import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import './App.global.css';
import AnnotatorMain from './views/AnnotatorMain';

// const dree = require('dree');

// var recursive = require('recursive-readdir');

// function dirget() {
//   recursive(
//     '/Users/cdushmantha/Downloads/mobile-supply-chain-management-11.2-SNAPSHOT-jar-with-dependencies/web',
//     function (err: any, files: any) {
//       // `files` is an array of file paths
//       console.log(files);
//       console.log(err);
//     }
//   );
//   return null;
// }

// const tree = dree.scan(
//   '/Users/cdushmantha/Downloads/mobile-supply-chain-management-11.2-SNAPSHOT-jar-with-dependencies/web'
// );

// const Hello = () => {
//   return (
//     <div>
//       <p>{dirget()}</p>
//       <div className="Hello">
//         <img width="200px" alt="icon" src={icon} />
//       </div>
//       <h1>electron-react-boilerplate</h1>
//       <div className="Hello">
//         <a
//           href="https://electron-react-boilerplate.js.org/"
//           target="_blank"
//           rel="noreferrer"
//         >
//           <button type="button">
//             <span role="img" aria-label="books">
//               📚
//             </span>
//             Read our docs
//           </button>
//         </a>
//         <a
//           href="https://github.com/sponsors/electron-react-boilerplate"
//           target="_blank"
//           rel="noreferrer"
//         >
//           <button type="button">
//             <span role="img" aria-label="books">
//               🙏
//             </span>
//             Donate
//           </button>
//         </a>
//       </div>
//     </div>
//   );
// };

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={AnnotatorMain} />
      </Switch>
    </Router>
  );
}
