const fs = require('fs');
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// HANDLERS
//GET ALL TOURS
exports.getAllTours = (req,res)=>{
    console.log(req.requestTime);

    res
    .status(200) //status code
    .json({
        status: `sucess`, 
        requestedAt: req.requestTime,
        results: tours.length, //number of results
        data: {
            tours //data parsed from dev_data 
        }
    });
}
// GET TOUR 
exports.getTour = (req,res)=>{
    console.log(req.params);

    const id = req.params.id * 1;
    const tour = tours.find(el => el.id=== id);

    // if(id>tours.length)
    if (!tour)
    {return res.status(404).json({
        status:'fail',
        message: 'failed to find id'
    })}
    

    res
    .status(200) //status code
    .json({
        status: `success`, 
        data: {
            tour //data parsed from dev_data 
        }
    })
}
// CREATE TOUR 
exports.createTour =(req,res)=>{
    // console.log(req.body);
    const newId = tours[tours.length -1].id+1;
    const newTour = Object.assign({id:newId},req.body) 
    
    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err =>{
        res
        .status(201)
        .json({
            status:'success',
            data:{
                tour:newTour
            }
        });
    });
    
    // res.send('done'); //cannot send two
}
// UPDATE TOUR 
exports.updateTour = (req,res)=>{

    if(req.params.id * 1 >tours.length)
        {return res.status(404).json({
            status:'fail',
            message: 'failed to find id'
        })}
     res
        .status(200)
        .json({
            status:'success',
            data:{
                tour:"updated data here"
            }
        })
        
}
// DELETE TOUR 
exports.deleteTour = (req,res)=>{

    if(req.params.id * 1 >tours.length)
        {return res.status(404).json({
            status:'fail',
            message: 'failed to find id'
        })}
     res
        .status(204)
        .json({
            status:'success',
            data:null
        })
        
}

