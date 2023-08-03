import React, {ReactNode, useState} from 'react';
import {Box, Button} from "@mui/material";
import NavTabs, {TabType} from "./Tabs";
import LogoutIcon from '@mui/icons-material/Logout';
import EntityViewer from "../EntityViewer";

type LayoutProps = {
  children?: ReactNode
}


const tabs:TabType[] = [
  {label: 'Категории', entity: 'categories'},
  {label: 'Наборы навыков', entity: 'presets'},
  {label: 'Ключевые слова', entity: 'keywords'},
]


const Layout = ({}: LayoutProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue);
  };

  return (
      <Box
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%'}}
      >
        <Box sx={{width: 200, bgcolor: 'background.paper', padding: '60px 0 10px', borderRight: 1, borderColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <NavTabs tabs={tabs} value={activeTabIndex} onTabChange={handleChange}/>
          <Button variant={'text'} endIcon={<LogoutIcon/>}>Выйти</Button>
        </Box>
        <EntityViewer entity={tabs[activeTabIndex].entity}/>
      </Box>
  );
};

export default Layout;
