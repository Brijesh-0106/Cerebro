import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import type { Option } from "../Models/CardProps";

type Props = {
  value: Option[];
  onChange: (val: Option[]) => void;
};

export default function MultiTagSelect({ value, onChange }: Props) {
  const styles = {
    multiValue: (base: any, { data }: any) => ({
      ...base,
      backgroundColor: data.color,
      borderRadius: "6px",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: "#fff",
      fontWeight: 500,
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: "#fff",
      ":hover": {
        backgroundColor: "rgba(0,0,0,0.2)",
        color: "#fff",
      },
    }),
  };

  function getRandomColor() {
    const colors = [
      "#EF4444",
      "#F97316",
      "#FACC15",
      "#22C55E",
      "#3B82F6",
      "#8B5CF6",
      "#EC4899",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const [options, setOptions] = useState<Option[]>([
    { label: "Bug", value: "bug", color: getRandomColor() },
    { label: "Feature request", value: "feature", color: getRandomColor() },
    { label: "Polish", value: "polish", color: getRandomColor() },
    { label: "Build", value: "build", color: getRandomColor() },
  ]);

  return (
    <CreatableSelect
      isMulti
      className="w-full"
      options={options}
      styles={styles}
      value={value}
      onChange={(newValue) => onChange(newValue as Option[])}
      onCreateOption={(inputValue) => {
        const newOption: Option = {
          label: inputValue,
          value: inputValue.toLowerCase().replace(/\s+/g, "-"),
          color: getRandomColor(),
        };

        setOptions((prev) => [...prev, newOption]);
        onChange([...(value || []), newOption]);
      }}
      placeholder="Select or create tags..."
    />
  );
}
