import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
const data = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
    { name: 'Aug', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Sep', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Oct', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Nov', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Dec', uv: 1890, pv: 4800, amt: 2181 },
  ];
  const ExampleChart = () => {
    return (
      <div>
        <h1>Bar and Line Chart Example</h1>
        <BarChart width={800} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" />
        </BarChart>
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </div>
    );
  };
export default  ExampleChart;   