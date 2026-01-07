import { useClickOutside } from "@/hooks/useClickOutside";
import { useSuggestionNavigation } from "@/hooks/useSuggestionNavigation";
import { suggestion } from "@/utils/types/types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SuggestionsList from "../HomeView/components/SuggestionsList";
import { inputClass } from "../SamplesView/components/SampleFormModal/components/SampleFormFields";

interface Props {
  name: string;
  value: string | boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  options?: string[];
}

const AutocompleteField: React.FC<Props> = ({
  name,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  options,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions: suggestion[] = useMemo(() => {
    const query = (value ?? "").toString().trim().toUpperCase();
    if (!query) return [];

    const safeOptions = options ?? [];

    return safeOptions
      .filter((opt) => opt.toUpperCase().includes(query))
      .slice(0, 8)
      .map((opt) => ({ id: opt })) as suggestion[];
  }, [options, value]);

  const handleSuggestionClick = (suggestion: suggestion) => {
    const syntheticEvent = {
      target: {
        name,
        value: suggestion.id,
        type: "text",
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
    setShowSuggestions(false);
  };

  const { handleKeyDown, selectedIndex, setSelectedIndex } =
    useSuggestionNavigation(
      filteredSuggestions,
      showSuggestions,
      setShowSuggestions,
      handleSuggestionClick
    );

  useClickOutside(wrapperRef, () => setShowSuggestions(false));

  useEffect(() => {
    setSelectedIndex(-1);
    if (filteredSuggestions.length === 0) setShowSuggestions(false);
  }, [filteredSuggestions, setSelectedIndex]);

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        name={name}
        value={value as string}
        onChange={(e) => {
          onChange(e);
          setShowSuggestions(true);
        }}
        onFocus={() => {
          if (filteredSuggestions.length > 0) setShowSuggestions(true);
        }}
        onKeyDown={handleKeyDown}
        className={`${inputClass} uppercase`}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete="off"
        autoFocus={false}
      />

      {showSuggestions && filteredSuggestions.length > 0 && (
        <SuggestionsList
          suggestions={filteredSuggestions}
          handleSuggestionClick={handleSuggestionClick}
          selectedIndex={selectedIndex}
        />
      )}
    </div>
  );
};

export default AutocompleteField;
