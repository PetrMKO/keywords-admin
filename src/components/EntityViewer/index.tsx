import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField
} from "@mui/material";
import {Category, Keyword, Preset} from "./entityTypes";
import ReplayIcon from '@mui/icons-material/Replay';
import axios from "axios";
import {DefaultResponse} from "../../types";
import {mockCategories, mockPresets,} from "./mockObjects";
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeywordEditor from "../EditModals/KeywordEditor";
import Loader from "../Loader";


export const entities = ['categories', 'presets', 'keywords'] as const

export type EntityType = typeof entities[number]

type EntityEditorProps = {
  entity: EntityType
}

const categoryColumns: GridColDef[] = [
  {field: 'id', headerName: 'ID', width: 70},
  {field: 'name', headerName: 'Название категории', flex: 2}
]
const presetColumns: GridColDef[] = [
  {field: 'id', headerName: 'ID', width: 70},
  {field: 'title', headerName: 'Название пресета', flex: 2},
  {field: 'categories', headerName: 'Категории', flex: 1,},
]

const keywordsColumns: GridColDef[] = [
  {field: 'id', headerName: 'ID', width: 70},
  {field: 'text', headerName: 'Ключевое слово', flex: 2},
  {field: 'presets', headerName: 'Пресеты', flex: 1,},
  {field: 'categories', headerName: 'Категории', flex: 1,},
]

type ColumnModelsByEntities = {
  [key in EntityType]: GridColDef[];
}

const columnModelsByEntities: ColumnModelsByEntities = {
  'categories': categoryColumns,
  'presets': presetColumns,
  'keywords': keywordsColumns
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  display: 'flex',
  flexDirection: 'column',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  boxShadow: 24,
  p: 2,
  gap: '10px'
};


const EntityViewer = ({entity}: EntityEditorProps) => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [categoryVariants, setCategoryVariants] = useState<Category[] | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  const [presetVariants, setPresetsVariants] = useState<Preset[] | null>(null)
  const [selectedPresets, setSelectedPresets] = useState<number[]>([])

  const [rows, setRows] = useState<Category[] | Preset[] | Keyword[]>([])

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isRowMenuOpen = Boolean(anchorEl);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null)
  };

  useEffect(() => {
    axios.get<DefaultResponse<Array<Category>>>('https://api.profiling.track.itmo.su/categories/').then(res =>
      setCategoryVariants(res.data.results)
    ).catch(() => {
      setCategoryVariants(mockCategories)
    })

    axios.get<DefaultResponse<Array<Preset>>>('https://api.profiling.track.itmo.su/presets/').then(res =>
      setPresetsVariants(res.data.results)
    ).catch(() => {
      setPresetsVariants(mockPresets)
    })
  }, [])

  const dropFilters = () => {
    setSelectedCategories([])
    setSelectedPresets([])
    setSearchQuery('')
  }

  const deleteEntity = () => {
    console.log('try to delete-', entity, selectedRowId)
  }

  const getData = async () => {
    setIsDataLoading(true)
    const presetFilter = selectedPresets.length > 0 ? `presets=${selectedPresets.join(',')}`:null
    const categoriesFilter =  selectedCategories.length > 0 ? `categories=${selectedCategories.join(',')}`:null
    const textFilter = searchQuery.length > 0 ? `text=${searchQuery}` : null

    const url = `https://api.profiling.track.itmo.su/${entity}/?${[presetFilter, categoriesFilter, textFilter].filter(item=>!!item).join('&&')}`

    const rows = await axios.get(url)

    setRows(rows.data.results)
    setIsDataLoading(false)
  }

  useEffect(() => {
    getData()
  }, [entity, searchQuery, selectedCategories.length, selectedPresets.length])

  return (
    <>
      <Box sx={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
        <Box sx={{
          display: 'flex',
          bgColor: 'primary.dark',
          padding: '10px',
          gap: '20px',
          borderBottom: 1,
          borderColor: 'rgba(0, 0, 0, 0.6)'
        }}>
          <TextField label="Название" variant="outlined" size={'small'} value={searchQuery}
                     onChange={(event) => {
                       setSearchQuery(event.target.value)}
                     }/>

          {(entity === 'presets' || entity ==='keywords') &&
            <FormControl size={'small'} sx={{width: 220}}>
              <InputLabel id="category-select-label">Категория</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                placeholder="Категория"
                label="Категория"
                multiple
                value={selectedCategories}
                onChange={(event) => {
                  // @ts-ignore
                  setSelectedCategories(event.target.value)
                }}
              >
                {categoryVariants ? categoryVariants.map((variant) =>
                  <MenuItem value={variant.id} key={variant.id}>{variant.name}</MenuItem>
                ) : <CircularProgress/>}
              </Select>
            </FormControl>
          }

          {entity ==='keywords' &&
            <FormControl size={'small'} sx={{width: 220}}>
              <InputLabel id="preset-select-label">Пресет</InputLabel>
              <Select
                labelId="preset-select-label"
                id="preset-select"
                placeholder="Пресет"
                label="Пресет"
                multiple
                value={selectedPresets}
                onChange={(event) => {
                  // @ts-ignore
                  setSelectedPresets(event.target.value)
                }}
              >
                {presetVariants ? presetVariants.map((variant) =>
                  <MenuItem value={variant.id} key={variant.id}>{variant.title}</MenuItem>
                ) : <CircularProgress/>}
              </Select>
            </FormControl>
          }

          <Button size="small" variant="outlined" onClick={dropFilters}
                  disabled={!(selectedCategories.length || selectedPresets.length || searchQuery)}>Сбросить
            фильтры</Button>
          <IconButton color={'primary'} size="small" onClick={()=>getData()}>
            <ReplayIcon/>
          </IconButton>
        </Box>

        {isDataLoading ?
          <Loader height={'60%'} width={'100%'}/>
          :
          <DataGrid
            columns={[...(columnModelsByEntities[entity]), {
              field: '', headerName: '', width: 60, renderCell: (cell) =>
                <IconButton
                  id="TableCellButton"
                  aria-controls={isRowMenuOpen ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={isRowMenuOpen ? 'true' : undefined}
                  onClick={(event) => {
                    setSelectedRowId(cell.row.id)
                    handleClick(event)
                  }}
                >
                  <MoreVertIcon/>
                </IconButton>
            }]}
            rows={rows}/>
        }

        <Menu
          id="TableCellMenu"
          anchorEl={anchorEl}
          open={isRowMenuOpen}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={() => {
            deleteEntity()
            handleClose()
          }}>Удалить</MenuItem>
          <MenuItem onClick={() => setIsEditModalOpen(true)}>Редактировать</MenuItem>
        </Menu>
      </Box>

      {typeof selectedRowId === 'number' &&
        <Modal  onClose={()=>setIsEditModalOpen(false)} open={isEditModalOpen}>
          <Paper sx={modalStyle}>
            {entity === 'keywords' && <KeywordEditor id={selectedRowId}/>}
          </Paper>
        </Modal>
      }

    </>
  );
};

export default EntityViewer;
