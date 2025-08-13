import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';
import axios from 'axios';
import { useEffect, useState } from 'react';


function renderRow(props: ListChildComponentProps, apiaries: any[]) {
  const { index, style } = props;
  const apiary = apiaries[index];
  
  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={apiary.name} />
      </ListItemButton>
    </ListItem>
  );
}

export default function VirtualizedList() {
  const [apiaries, setApiaries] = useState([]);

  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/apiaries`)
          .then(response => setApiaries(response.data));
  }, []);

  return (
    <Box
      sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
    >
      <FixedSizeList
        height={400}
        width={360}
        itemSize={46}
        itemCount={apiaries.length} //adapter a la longueur de la liste des ruchers
        overscanCount={5}
      >
        {(props) => renderRow(props, apiaries)}
      </FixedSizeList>
    </Box>
  );
}