import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Timeline = ({mentalIllnessData}) => {
  const tmp = {
    labels: [''],
    datasets: [
      {
        label: 'Sales',
        data: [1],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };
  const [data, setdata] = useState(tmp);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
         
        let result;
        if(typeof mentalIllnessData !== 'undefined'){
          
          let year = [];
          let total = []
          let mental = [];
          let gun = [];
          let knife = [];
          let bo = [];
          let rep = [];
          let una = [];
          let veh = [];
          for(let i = 0; i < mentalIllnessData.length; i++){
           
            year.push( mentalIllnessData[i].date_part );
            total.push( mentalIllnessData[i].total_number)
            mental.push(parseInt(mentalIllnessData[i].mental_number));
            gun.push(parseInt(mentalIllnessData[i].gun));
            knife.push(parseInt(mentalIllnessData[i].knife));
            bo.push(parseInt(mentalIllnessData[i].bo));
            rep.push(parseInt(mentalIllnessData[i].rep));
            una.push(parseInt(mentalIllnessData[i].una));
            veh.push(parseInt(mentalIllnessData[i].veh));
          }
          
          result = {
            labels: year,
            datasets: [
              {
                label: 'Total Victims',
                data: total,
                borderColor: 'red',
                backgroundColor: 'red',
                fill: true,
              },
              {
                label: 'Mental Illness Related',
                data: mental,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
              },
              {
                label: 'Armed With Gun',
                data: gun,
                borderColor: 'green',
                backgroundColor: 'green',
                fill: true,
              },
              {
                label: 'Armed With Knife',
                data: knife,
                borderColor: 'blue',
                backgroundColor: 'blue',
                fill: true,
              },
              {
                label: 'Armed With Blunt Object',
                data: bo,
                borderColor: 'yellow',
                backgroundColor: 'yellow',
                fill: true,
              },
              {
                label: 'Armed With Replica',
                data: rep,
                borderColor: 'black',
                backgroundColor: 'black',
                fill: true,
              },
              {
                label: 'Unarmed',
                data: una,
                borderColor: 'pink',
                backgroundColor: 'pink',
                fill: true,
              },
              {
                label: 'Armed With Vehicle',
                data: veh,
                borderColor: 'purple',
                backgroundColor: 'purple',
                fill: true,
              },
            ],
          };
          
          setdata(result);
        }else{
          result = {
            labels: ["a"],
            datasets: [
              {
                label: 'mental',
                data: [1],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
              },
            ],
          };
          setdata(result);
          
        }
        
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [mentalIllnessData]);
  
  const options = {
    maintainAspectRatio: false,
  };

  return (
    <div>
      <Line data={data} height='500px' width='500px' options={options} />
    </div>
  );

};

export default Timeline;
