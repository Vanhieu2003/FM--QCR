"use client"

import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Rating } from '@mui/material';
import React, { useEffect, useState } from 'react'

interface Props {
  criteriaID?: string;
  inputRatingType: string;
  disabled?: boolean;
  value?: number | null;
  onValueChange?: (criteriaId: string, value: any) => void;
}

const RenderRatingInput = ({ criteriaID, inputRatingType, disabled = false, value, onValueChange }: Props) => {
  const [newValue,setNewValue] = useState<number | string |null>(null);
  const handleChange = (ratingValue: number | null | string) => {

    setNewValue(ratingValue);
    onValueChange?.(criteriaID ? criteriaID : '', ratingValue);
  };

  switch (inputRatingType) {
    case "BINARY":
      return (
        <RadioGroup
          row
          value ={newValue ? newValue : value}
          onChange={(e)=>handleChange(e.target.value)}
        >
          <FormControlLabel value="1"control={<Radio />} label="Đạt" sx={{margin:0}} disabled={disabled} />
          <FormControlLabel value="0" control={<Radio />} label="Không đạt" sx={{margin:0}} disabled={disabled} />
        </RadioGroup> 
      );
    case "RATING":
      return (
        <Rating
          value={value || 0}
          onChange={(event, newValue) => handleChange(newValue)}
          disabled={disabled}
        />
      );
    default:
      return null;
  }
}

export default RenderRatingInput;