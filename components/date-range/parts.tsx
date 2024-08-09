import { useDayPicker, useSelectRange } from 'react-day-picker';
import { format, getMonth } from 'date-fns';

export function DateRangeCaptionLabel(props: any) {
  const FORMAT_DATE = "LLL dd, y";
  const context = useDayPicker();
  const anotherShit = useSelectRange();

  console.log(context);
  console.log(anotherShit)
  console.log(format(props.displayMonth, FORMAT_DATE));

  return (
    <div>
      <DateRangeCaptionLabelMonth/>
    </div>
  );
}

function DateRangeCaptionLabelMonth() {
  console.log(getMonth(new Date()))
  return <span></span>
}