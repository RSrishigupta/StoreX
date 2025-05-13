"use client";

import {
  Button,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  Box,
  FormControl,
  Input,
  InputAdornment,
  Divider,
} from "@mui/material";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

interface TypeButtonProps {
  selectedTypes: string[];
  onTypeSelect: (types: string[]) => void;
}

const allTypes = ["Employee", "Intern", "Freelancer"];

const TypeButton: React.FC<TypeButtonProps> = ({ selectedTypes, onTypeSelect }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState("");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSearch(""); // Reset search
  };

  const handleCheckboxChange = (type: string) => {
    const updated = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    onTypeSelect(updated);
  };

  const filteredTypes = allTypes.filter((type) =>
    type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddCircleOutlineOutlinedIcon/>}
        size="small"
        onClick={handleClick}
        sx={{
          border: "1px dashed rgba(169, 169, 169, 0.5)",
          textTransform: "none",
          padding: "2px 6px",
          minHeight: "32px",
          lineHeight: 1,
          fontSize: "0.75rem",
          color: "black",
        }}
      >
        {selectedTypes.length > 0 ? selectedTypes.join(", ") : "Type"}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {/* Custom Styled Search Box */}
        <Box display="flex" justifyContent="center">
          <FormControl variant="standard" sx={{
            width: 160,
          }}>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search type"
              disableUnderline
              
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              }
              sx={{
                backgroundColor: "#fffff",
                borderRadius: "8px",
                padding: "4px 8px",
                fontSize: "0.8rem",
                // height: "40px",
                
              }}
            />
          </FormControl>
        </Box>
        <Divider/>

        {/* Type List */}
        {filteredTypes.map((type) => (
          <MenuItem
            key={type}
            onClick={() => handleCheckboxChange(type)}
            dense
            sx={{ fontSize: "0.75rem" }}
          >
            <Checkbox
              checked={selectedTypes.includes(type)}
              size="small"
              sx={{ padding: 0.5, marginRight: 1 }}
            />
            <ListItemText primary={type} />
          </MenuItem>
        ))}

        {filteredTypes.length === 0 && (
          <MenuItem disabled sx={{ fontSize: "0.75rem", opacity: 0.6 }}>
            No results
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default TypeButton;
