import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Card, CardBody, CardTitle } from 'reactstrap'

ChartJS.register(ArcElement, Tooltip, Legend)

const PieChart = ({ title, data, labels, colors }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: colors || [
          'rgba(94, 114, 228, 0.8)',
          'rgba(45, 206, 137, 0.8)',
          'rgba(251, 99, 64, 0.8)',
          'rgba(17, 205, 239, 0.8)',
          'rgba(245, 54, 92, 0.8)',
        ],
        borderColor: colors || [
          'rgba(94, 114, 228, 1)',
          'rgba(45, 206, 137, 1)',
          'rgba(251, 99, 64, 1)',
          'rgba(17, 205, 239, 1)',
          'rgba(245, 54, 92, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 8,
      },
    },
  }

  return (
    <Card className="shadow">
      <CardBody>
        <CardTitle tag="h6" className="text-uppercase text-muted mb-3">
          {title}
        </CardTitle>
        <div style={{ position: 'relative', height: '300px' }}>
          <Pie data={chartData} options={options} />
        </div>
      </CardBody>
    </Card>
  )
}

export default PieChart
