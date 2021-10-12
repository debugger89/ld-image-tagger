import React from 'react';
import ReactImageAnnotate from 'react-image-annotate';

import TreeMenu from 'react-simple-tree-menu';
import { v4 as uuidv4 } from 'uuid';

import Box from '@mui/material/Box';
import { Grid, Item, TextField, Button } from '@mui/material';

function AnnotatorMain(props) {
  const fileInput = React.createRef();
  const [rootFolderPath, setRootFolderPath] = React.useState(
    '/Users/cdushmantha/Documents/code/github/LeopardDiary-PublicWeb/leopard-diary-webapp/src/assets/img/identified-leopards/YALA_NP'
  );
  const [destFolderPath, setDestFolderPath] = React.useState(
    '/Users/cdushmantha/Downloads/annots'
  );

  const [annotatorKey, setAnnotatorKey] = React.useState(uuidv4());

  const [folderHierarchy, setFolderHierarchy] = React.useState([]);

  const url = require('url');
  const path = require('path');
  const fs = require('fs');

  const [annotatingImage, setAnnotatingImage] = React.useState([
    {
      key: uuidv4(),
      src: url.pathToFileURL('src/renderer/img/placeholder.jpeg').toString(),
      name: 'Image 1',
      regions: [],
    },
  ]);

  function jsonBuilder(buildArr, currentNode) {
    // console.log('%%%%%%%% RECURSION %%%%%%%%');

    currentNode.forEach(function myFunction(item, index) {
      var addItem = {};

      if (item.name.startsWith('.')) {
        return;
      }
      // console.log('*****ITERATION*****');
      // console.log('*** ' + item.name);
      addItem.key = item.name;
      addItem.label = item.name;
      addItem.path = item.path;
      addItem.type = item.type;
      if (item.children && item.children != []) {
        // console.log(item.name + ' *** has children');

        addItem.nodes = [];

        jsonBuilder(addItem.nodes, item.children);
      }
      buildArr.push(addItem);
    });

    return buildArr;
  }

  function handleRootChange(event) {
    console.log('Root Folder path : ' + rootFolderPath);
    setRootFolderPath(event.target.value);
  }

  function handleDestChange(event) {
    console.log('Dest Folder path : ' + rootFolderPath);
    setDestFolderPath(event.target.value);
  }

  function getDirContent() {
    const dree = require('dree');
    var tree = dree.scan(rootFolderPath);
    // console.log(JSON.stringify(tree));

    setFolderHierarchy(jsonBuilder([], [tree]));
  }

  function getImageVisibleName(imgPath) {
    return path.basename(path.dirname(imgPath)) + '/' + path.basename(imgPath);
  }

  function onSaveAnnot(data) {
    if (data.images.length > 0) {
      let imageData = data.images[0];

      // if no regions why save?
      if (imageData.regions.length < 1) {
        return;
      }
      // let saveFolder = path.dirname(imageData.src);

      let fileName = path.basename(imageData.src);
      let fileNameWithoutExt = fileName.split('.').slice(0, -1).join('.');
      let folderName = path.basename(path.dirname(imageData.src));
      let annotJsonPath =
        destFolderPath +
        '/' +
        folderName +
        '/' +
        (fileNameWithoutExt + '_annotations.json');

      console.log('Saving file in : ' + annotJsonPath);

      fs.mkdirSync(path.dirname(annotJsonPath), { recursive: true }, (err) => {
        if (err) throw err;
      });

      fs.writeFileSync(annotJsonPath, JSON.stringify(imageData));
    }
  }

  function saveElementByXpath() {
    var element = document.evaluate(
      "//div[@class='fullscreen']/div[@tabindex='-1']//div[contains(@class,'headerTitle')]/../../button[position()=last()]",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    element.click();
  }

  function onSelectionChange({ key, label, ...props }) {
    saveElementByXpath();
    if (props.type === 'file') {
      let fileName = path.basename(props.path);
      let fileNameWithoutExt = fileName.split('.').slice(0, -1).join('.');
      let folderName = path.basename(path.dirname(props.path));

      // read existing annots
      let annotRegions = [];

      let annotJsonPath =
        destFolderPath +
        '/' +
        folderName +
        '/' +
        (fileNameWithoutExt + '_annotations.json');

      console.log('Check annot file in path : ' + annotJsonPath);
      console.log('Annot File Exists? : ' + fs.existsSync(annotJsonPath));

      if (fs.existsSync(annotJsonPath)) {
        annotRegions = JSON.parse(fs.readFileSync(annotJsonPath)).regions;
        //console.log(annotRegions);
      }

      var fileURL = url.pathToFileURL(props.path).toString();
      console.log('New Selected path : ' + fileURL);
      // setSelectedImageURL(fileURL);
      setAnnotatingImage([
        {
          key: uuidv4(),
          src: fileURL,
          name: getImageVisibleName(props.path),
          regions: annotRegions,
        },
      ]);

      setAnnotatorKey(uuidv4());
    }
  }

  React.useEffect(() => {
    console.log(JSON.stringify(annotatingImage));
  });

  return (
    <>
      <div>
        <Grid container spacing={2} className="expanded-row">
          <Grid item xs={3}>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  fullWidth
                  label="Root Folder Path"
                  variant="standard"
                  onChange={(e) => handleRootChange(e)}
                  value={rootFolderPath}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Destination Folder Path"
                  variant="standard"
                  onChange={(e) => handleDestChange(e)}
                  value={destFolderPath}
                />
              </div>
              <div>
                <Button variant="outlined" onClick={(e) => getDirContent()}>
                  Load
                </Button>
              </div>
              <div className="tree-container">
                <TreeMenu
                  data={folderHierarchy}
                  hasSearch={false}
                  onClickItem={onSelectionChange}
                  // onClickItem={({ key, label, ...props }) => {
                  //   saveElementByXpath();
                  //   if (props.type === 'file') {
                  //     // read existing annots
                  //     let annotRegions = [];
                  //     let annotJsonPath = path.dirname(
                  //       props.path + '/' + props.label + '_annotations.json'
                  //     );
                  //     console.log(
                  //       'Annot File Exists? : ' + fs.existsSync(annotJsonPath)
                  //     );
                  //     if (fs.existsSync(annotJsonPath)) {
                  //       annotRegions = JSON.parse(
                  //         fs.readFileSync(annotJsonPath)
                  //       ).regions;
                  //       console.log(annotRegions);
                  //     }

                  //     var fileURL = url.pathToFileURL(props.path).toString();
                  //     console.log('New Selected path : ' + fileURL);
                  //     // setSelectedImageURL(fileURL);
                  //     setAnnotatingImage([
                  //       {
                  //         src: fileURL,
                  //         name: getImageVisibleName(props.path),
                  //         regions: annotRegions,
                  //       },
                  //     ]);

                  //     setAnnotatorKey(uuidv4());
                  //   }
                  // }}
                />
              </div>
            </Box>
          </Grid>
          <Grid item xs={9}>
            <ReactImageAnnotate
              key={annotatorKey}
              labelImages
              className="annot-container"
              regionClsList={['front', 'left', 'right', 'head']}
              // regionTagList={['front', 'left', 'right']}
              images={annotatingImage}
              enabledTools={['select', 'create-box', 'create-polygon']}
              onExit={onSaveAnnot}
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default AnnotatorMain;
