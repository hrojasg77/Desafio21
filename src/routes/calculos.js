export default function controllerCalcula(req,res){
    let limite
    if(!req.query.cant)
    {
        limite = 100000000
    }
    else
    {
        limite = req.query.cant        
    }

    const computo = fork('src/computo.js')
    computo.send({ limite: limite });

    computo.on('message', msg => {
        if (msg === 'listo') {
            
        } 
        else
        {
            res.send(msg)
        }
    })
}
