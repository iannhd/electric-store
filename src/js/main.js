import productdb, {
    bulkcreate,
    createEle,
    getData
} from './module.js'

let db = productdb("Productdb", {
    products: `++id, name, seller, price`
})

// input tags

const userid = document.getElementById('userid')
const proname = document.getElementById('proname')
const seller = document.getElementById('seller')
const price = document.getElementById('price')

// not found div

const notfound = document.getElementById('notfound')

// buttons

const btncreate = document.getElementById('btn-create')
const btnread = document.getElementById('btn-read')
const btnupdate = document.getElementById('btn-update')
const btndelete = document.getElementById('btn-delete')

// insert value using create button
btncreate.onclick = (event) => {
    let flag = bulkcreate(db.products, {
        name: proname.value,
        seller: seller.value,
        price: price.value,
    })
    proname.value = seller.value = price.value = ''
    getData(db.products, (data) => {
        userid.value = data.id + 1 || 1
    })

    table()

    let insertmsg = document.querySelector('.insertmsg')

    getMsg(flag, insertmsg)
}

// create event on read button
btnread.onclick = table 

// event update
btnupdate.onclick = () => {
    const id = parseInt(userid.value) || 0
    console.log(typeof(id));
    if(id){
        db.products.update(id, {
            name: proname.value,
            seller: seller.value,
            price:price.value
        }).then((updated)=>{
            // let get = updated ? `Data Updated` : `Could'nt Update`

            let get = updated ? true : false

            let updatemsg = document.querySelector('.updatemsg')
            getMsg(get, updatemsg)
        })
    }
}

// delete all

btndelete.onclick = () => {
    db.delete()
    console.log('You have delete all data')
    db = productdb('productDb', {
        products:`id++, name, seller, price`
    })
    db.open()
    table()
    textID(userid)

    let deletemsg = document.querySelector('.deletemsg')
    getMsg(true, deletemsg)
}

// window onload event

window.onload = () => {
    textID(userid)
}

function textID(textboxid){
    getData(db.products, data => {
        textboxid.value = data.id + 1 || 1
    })
}

function table(){
    const tbody = document.getElementById('tbody')

    while(tbody.hasChildNodes()){
        tbody.removeChild(tbody.firstChild)
    }

    getData(db.products, (data)=>{
        if(data){
            createEle("tr", tbody, tr => {
                for (const value in data) {
                  createEle("td", tr, td => {
                    td.textContent = data.price === data[value] ? `$ ${data[value]}` : data[value];
                  });
                }
                createEle("td", tr, td => {
                  createEle("i", td, i => {
                    i.className += "fas fa-edit btnedit";
                    i.setAttribute(`data-id`, data.id);
                    // store number of edit buttons
                    i.onclick = editbtn;
                  });
                })
                createEle("td", tr, td => {
                  createEle("i", td, i => {
                    i.className += "fas fa-trash-alt btndelete";
                    i.setAttribute(`data-id`, data.id);
                    // store number of edit buttons
                    i.onclick = deletebtn;
                  });
                })
              });
        } else {
            notfound.textContent = `No record found in the database...!!`
        }
    })
}

function editbtn(event) {
    let id = parseInt(event.target.dataset.id)
    db.products.get(id, data => {
        userid.value = data.id || 0
        proname.value = data.name || ""
        seller.value = data.seller || ""
        price.value = data.price || ""
    })
}

function deletebtn(event){
    let id = parseInt(event.target.dataset.id)
    db.products.delete(id)
    // console.log(`You have deleted item with id: ${id}`)
    table()

   
}

function getMsg(flag, element){
    if(flag){
        element.className += ' movedown'

        setTimeout(() => {  
            element.classList.forEach (classname => {
                    classname == 'movedown' ? undefined : element.classList.remove('movedown')
            })
        }, 4000)
    }
}