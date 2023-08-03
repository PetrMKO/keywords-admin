import React from 'react';
import {Tab, Tabs} from "@mui/material";
import {EntityType} from '../../EntityViewer'

export type TabType = {
  label: string,
  entity: EntityType
}

type TabsProps = {
  tabs: TabType[],
  value: number,
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const NavTabs = ({tabs, value, onTabChange}:TabsProps) => {

  return (
    <Tabs
      orientation="vertical"
      variant='fullWidth'
      onChange={onTabChange}
      value={value}
      indicatorColor="secondary"
      textColor="primary"
    >
      {tabs.map((tab, index)=>
        <Tab label={tab.label}
             key={tab.label}
             sx={{alignItems: 'flex-start'}}
             {...a11yProps(index)}
        />
      )}
    </Tabs>
  )
};

export default NavTabs;
