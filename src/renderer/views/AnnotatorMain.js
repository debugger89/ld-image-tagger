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

  const [annotatorKey, setAnnotatorKey] = React.useState(uuidv4());

  const [folderHierarchy, setFolderHierarchy] = React.useState([]);

  const url = require('url');
  const path = require('path');
  const fs = require('fs');

  const [annotatingImage, setAnnotatingImage] = React.useState([
    {
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

  function handleChange(event) {
    console.log('Folder path : ' + rootFolderPath);
    setRootFolderPath(event.target.value);
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
      let saveFolder = path.dirname(imageData.src);
      console.log('Saving file in : ' + saveFolder);
      fs.writeFileSync(
        url.fileURLToPath(saveFolder + '/annotations.json'),
        JSON.stringify(imageData)
      );
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
                  onChange={(e) => handleChange(e)}
                  value={rootFolderPath}
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
                  onClickItem={({ key, label, ...props }) => {
                    if (props.type === 'file') {
                      var fileURL = url.pathToFileURL(props.path).toString();
                      console.log('Selected path : ' + fileURL);
                      // setSelectedImageURL(fileURL);
                      setAnnotatingImage([
                        {
                          src: fileURL,
                          name: getImageVisibleName(props.path),
                          regions: [],
                        },
                      ]);

                      setAnnotatorKey(uuidv4());
                    }
                  }}
                />
              </div>
            </Box>
          </Grid>
          <Grid item xs={9}>
            <ReactImageAnnotate
              key={annotatorKey}
              labelImages
              className="annot-container"
              regionClsList={['front', 'left', 'right']}
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
