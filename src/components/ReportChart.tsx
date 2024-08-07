import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface Props {
  options: Highcharts.Options
}
export const ReportChart = (props: Props) => {
  
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={props.options} />
  );
};
