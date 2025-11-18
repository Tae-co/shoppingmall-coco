import React from 'react';
import styled from 'styled-components';

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fafafa;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  input { margin-right: 8px; transform: scale(1.2); }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;
const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

function TagCheckboxGroup({ label, groupName, options, selectedValues, onChange }) {
  return (
    <FormGroup>
      <Label>{label} (중복 선택 가능)</Label>
      <CheckboxGroup>
        {options.map(opt => (
          <CheckboxLabel key={opt.id}>
            <input 
              type="checkbox" 
              checked={selectedValues.includes(opt.id)}
              onChange={() => onChange(groupName, opt.id)}
            />
            {opt.label}
          </CheckboxLabel>
        ))}
      </CheckboxGroup>
    </FormGroup>
  );
}

export default TagCheckboxGroup;