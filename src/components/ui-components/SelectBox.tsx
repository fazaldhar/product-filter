import { PropsWithChildren, ReactNode } from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { memo } from 'react';

interface Props extends PropsWithChildren {
  name: string;
  id: string;
  value: string | string[] | undefined;
  disabled: boolean;
  multiple?: boolean;
  renderValue?: (arg: string) => void;
  onChange: (arg: SelectChangeEvent) => void;
}

export const SelectBox = memo(({ name, id, value, onChange, disabled, multiple = false, renderValue, children } : Props) => {
  return (
    <>
      <FormControl sx={{ m: 1, width: 250 }} disabled={disabled}>
        <InputLabel id={id}>{name}</InputLabel>
        <Select
            labelId={id}
            value={value as string}
            multiple={multiple}
            label="Categories"
            onChange={onChange}
            renderValue={renderValue}
        >
          {children}
        </Select>
      </FormControl>
    </>
  )
});
