import React from 'react';


let columns = [
    {
        Header:'',
        id: 'color',
        accessor: row => <div className='color-box' style={{backgroundColor: row.color}} />,
        minWidth: 29,
        maxWidth: 29
    },
    {
        Header: 'Grade',
        accessor: `difficulty`,
        minWidth: 53,
        maxWidth: 53
     },
     {
         Header: 'Wall',
         accessor: 'wall',
         minWidth: 63,
         maxWidth: 80
     },
     {
         Header: 'Setter',
         accessor: 'setters_name',
         minWidth: 70,
         maxWidth: 95
     },
     {
         Header: 'Stars',
         id:'avg_stars',
         accessor: row => { let stars =[]
                             for(let i=0;i<row.avg_stars;i++){stars.push(i)}
                            return <div className='stars-container'> {stars.map((star,i)=><div key={i} className='star-icon'/>)}</div>
                         },
         minWidth: 50,
         maxWidth: 60
     }
]
export default columns