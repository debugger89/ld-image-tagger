import React from 'react';
import ReactImageAnnotate from 'react-image-annotate';

import TreeMenu from 'react-simple-tree-menu';

import Box from '@mui/material/Box';
import { Grid, Item, TextField, Button } from '@mui/material';

function AnnotatorMain(props) {
  const fileInput = React.createRef();
  const [rootFolderPath, setRootFolderPath] = React.useState(
    '/Users/cdushmantha/Documents/code/github/LeopardDiary-PublicWeb/leopard-diary-webapp/src/assets/img/identified-leopards/YALA_NP'
  );

  const [folderHierarchy, setFolderHierarchy] = React.useState([]);

  const treeData = [
    {
      key: 'Team Confidential Letters',
      label: 'Team Confidential Letters',
      nodes: [
        {
          key: '2019',
          label: '2019',
          nodes: [
            {
              key: 'Malik_310.pdf',
              label: 'Malik_310.pdf',
            },
            {
              key: 'Srimalee_312.pdf',
              label: 'Srimalee_312.pdf',
            },
          ],
        },
        {
          key: '2020',
          label: '2020',
          nodes: [
            {
              key: 'Srimalee_312.pdf',
              label: 'Srimalee_312.pdf',
            },
          ],
        },
      ],
    },
  ];

  function jsonBuilder(buildArr, currentNode) {
    console.log('%%%%%%%% RECURSION %%%%%%%%');

    currentNode.forEach(function myFunction(item, index) {
      var addItem = {};

      if (item.name.startsWith('.')) {
        return;
      }
      console.log('*****ITERATION*****');
      console.log('*** ' + item.name);
      addItem.key = item.name;
      addItem.label = item.name;
      if (item.children && item.children != []) {
        console.log(item.name + ' *** has children');

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
    console.log(JSON.stringify(tree));

    setFolderHierarchy(jsonBuilder([], [tree]));
  }

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
                <TreeMenu data={folderHierarchy} hasSearch={false} />
              </div>
            </Box>
          </Grid>
          <Grid item xs={9}>
            <ReactImageAnnotate
              labelImages
              className="annot-container"
              regionClsList={['Alpha', 'Beta', 'Charlie', 'Delta']}
              regionTagList={['tag1', 'tag2', 'tag3']}
              images={[
                {
                  src: 'https://placekitten.com/408/287',
                  name: 'Image 1',
                  regions: [],
                },
              ]}
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default AnnotatorMain;
