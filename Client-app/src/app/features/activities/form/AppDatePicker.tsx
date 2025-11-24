import { useEffect, useRef, useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { DayPicker } from "react-day-picker"
import { format, isValid, parse } from "date-fns";

interface props {
    onChange: Dispatch<SetStateAction<string>>;
    selected: string;
}

function AppDatePicker({ onChange, selected }: props) {
  const [month, setMonth] = useState<Date | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [dateInput, setDateInput] = useState<string>("");
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const date = parse(selected, "yyyy-MM-dd", new Date());
    if (isValid(date)) {
        setMonth(date);
        setSelectedDate(date);
        setDateInput(format(date, "yyyy-MM-dd"));
    }
  }, [selected]);

  useEffect(() => {
    function handleClick(ev: MouseEvent) {
      if (!popoverRef.current || !inputRef.current)
        return;
      if (inputRef.current.contains(ev.target as Node))
        return;
      if (popoverRef.current.contains(ev.target as Node)) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleDateInputChange(ev : ChangeEvent<HTMLInputElement>) {
    const value = ev.currentTarget.value;
    setDateInput(value);
    const date = parse(value, "yyyy-MM-dd", new Date());

    if (isValid(date)) {
      setMonth(date);
      setSelectedDate(date);
      setDateInput(value);
      onChange(format(date, "yyyy-MM-dd"));
    } else {
      setMonth(undefined);
      setSelectedDate(undefined)
      onChange("");
    }
  }

  function handleSelectDate(date: Date | undefined) {
    if (!date) {
      setMonth(undefined);
      setDateInput("");
      setSelectedDate(undefined)
      onChange("");
    } else {
      setMonth(date);
      setSelectedDate(date);
      const value = format(date, "yyyy-MM-dd");
      setDateInput(value);
      onChange(value);
    }
  }

  return (
    <div>
        <input
          ref={inputRef}
          className="input w-full"
          type="text"
          value={dateInput}
          placeholder="yyyy-MM-dd"
          onChange={handleDateInputChange}
          onClick={() => setOpen(true)}
        />
        <div 
          ref={popoverRef} 
          className={`
            absolute z-99 ${open ? "" : "hidden"}`
          }
          aria-hidden={!open}
          tabIndex={open ? 0 : -1}
        >
          <DayPicker
            className="react-day-picker"
            month={month}
            onMonthChange={setMonth}
            mode="single"
            selected={selectedDate}
            onSelect={handleSelectDate}
          />
        </div>
    </div>
  )
}

export default AppDatePicker