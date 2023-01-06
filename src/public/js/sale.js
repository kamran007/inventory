// date picker
// $('.datepicker').datepicker();
//  Necessary HTML TAG Initailization
let div_date=document.getElementById('date')
let select_product=document.getElementById('p')
let select_customer=document.getElementById('customer')
let select_paymentType = document.getElementById('paymentType');

let in_id = document.getElementById('id')
let in_pricePerUnit=document.getElementById('pricePerUnit')
let in_unit=document.getElementById('unit')
let in_price=document.getElementById('price')

let in_payable=document.getElementById('payable')
let in_discount=document.getElementById('discount')
let in_paid=document.getElementById('paid')
let in_due=document.getElementById('due')
let in_shippingCost = document.getElementById('shippingCost')
let div_optional = document.getElementById('optional');

let in_item=document.getElementById('item')
let in_itemPrice=document.getElementById('itemPrice')
let in_itemUnit=document.getElementById('itemUnit')
let in_itemTotal=document.getElementById('itemTotal')


let btn_add=document.getElementById('itemAdd')
let btn_resetItem=document.getElementById('resetItem')
let btn_resetSale=document.getElementById('resetSale')




//Auto total price set
in_unit.addEventListener('keyup',(event)=>{
    total=calcIndivisualProductTotal()
    in_price.value=total
})

// Final due Calculation
in_discount.addEventListener('keyup',(event)=>{
    setFinalValue()
})

in_paid.addEventListener('keyup',(event)=>{
    setFinalValue()
})

//shipment Cost add Effect
in_shippingCost.addEventListener('keyup',(event)=>{
    let payable=parseFloat(sumTableData(3)) + parseFloat(in_shippingCost.value);
    in_payable.value=payable.toFixed(2)
})

// Add button event listener
let selectedRow=null
btn_add.addEventListener('click',(event)=>{
    product_item=readProductData()
    let table=document.getElementById('productTable').getElementsByTagName('tbody')[0]
    let length=table.rows.length
    let item=[];
    for( let i=0; i<length; i++){
        item[i]=table.rows[i].cells[0].innerHTML
    }
    
    if(selectedRow==null && !(item.includes(product_item.id))){
        insertNewRow(product_item)
    }else{
        updateRow(product_item)
        btn_add.innerHTML='Add'
        selectedRow=null
    }
    resetProductForm()
    let payable=sumTableData(4) + parseFloat(in_shippingCost.value);
    in_payable.value=payable.toFixed(2)
    
})


btn_resetItem.addEventListener('click',(event)=>{
    resetProductForm()
})


btn_resetSale.addEventListener('click',(event)=>{
    resetSaleForm()
})

select_product.addEventListener('change',(event)=>{
    let {id,price}=select_product.options[select_product.selectedIndex].dataset;
    in_pricePerUnit.value=price
    in_id.value= id
})
// payment Type selet handler
select_paymentType.addEventListener('change',(event)=>{
    let value = select_paymentType.options[select_paymentType.selectedIndex].value
    if(value === 'Check'){
        div_optional.style.visibility ="visible";
    }
    else{
        div_optional.style.visibility ="hidden";
    }
})
function readProductData(){
    let data={}

    data['id']= in_id.value
    data['product']=select_product.options[select_product.selectedIndex].text
    data['pricePerUnit']=in_pricePerUnit.value
    data['unit']=in_unit.value
    data['price']=in_price.value
    return data
}


function insertNewRow(data){
    let table=document.getElementById('productTable').getElementsByTagName('tbody')[0]
    let newRow=table.insertRow(table.rows.length)

    let cell1=newRow.insertCell(0)
    let cell2=newRow.insertCell(1)
    let cell3=newRow.insertCell(2)
    let cell4=newRow.insertCell(3)
    let cell5=newRow.insertCell(4)
    let cell6=newRow.insertCell(5)

    cell1.innerHTML=data['id']
    cell2.innerHTML=data['product']
    cell3.innerHTML=data['pricePerUnit']
    cell4.innerHTML=data['unit']
    cell5.innerHTML=data['price']
    cell6.innerHTML=`<a class="mx-2 btn btn-outline-warning" onClick="onEdit(this)"><i class="bi bi-pencil-fill"></i></a>
                    <a class="mx-2 btn btn-outline-danger" onClick="onDelete(this)"><i class="bi bi-x-square-fill"></i></a>`
}

function updateRow(data){
    selectedRow.cells[0].innerHTML=data['id']
    selectedRow.cells[1].innerHTML=data['product']
    selectedRow.cells[2].innerHTML=data['pricePerUnit']
    selectedRow.cells[3].innerHTML=data['unit']
    selectedRow.cells[4].innerHTML=data['price']
}

function onEdit(td){
    selectedRow=td.parentElement.parentElement

    let id= selectedRow.cells[0].innerHTML
    let product=selectedRow.cells[1].innerHTML
    let pricePerUnit=selectedRow.cells[2].innerHTML
    let unit=selectedRow.cells[3].innerHTML
    let price=selectedRow.cells[4].innerHTML

    in_id.value= id.trim()
    select_product.selectedIndex=[...select_product.options].findIndex(option=> option.text.trim() == product.trim())
    in_pricePerUnit.value=pricePerUnit.trim()
    in_unit.value=unit.trim()
    in_price.value=price.trim()
    btn_add.innerHTML='Update'
}

function onDelete(td){
    let row=td.parentElement.parentElement
    document.getElementById('productTable').getElementsByTagName('tbody')[0].deleteRow(row.rowIndex-1)
    let payable=sumTableData(4)
    in_payable.value=payable
}

function prepareForSendData(){
    let item=[]
    let itemPrice=[]
    let itemUnit=[]
    let itemTotal=[]
    let table=document.getElementById('productTable').getElementsByTagName('tbody')[0]
    let length=table.rows.length
    for( let i=0; i<length; i++){
        item[i]=table.rows[i].cells[0].innerHTML
        itemPrice[i]=table.rows[i].cells[2].innerHTML
        itemUnit[i]=table.rows[i].cells[3].innerHTML
        itemTotal[i]=table.rows[i].cells[4].innerHTML
    }
    in_item.value=item
    in_itemPrice.value=itemPrice
    in_itemUnit.value=itemUnit
    in_itemTotal.value=itemTotal
}

function resetProductForm(){
    in_id.value= ''
    select_product.value=''
    in_pricePerUnit.value=''
    in_unit.value=''
    in_price.value=''
}

function calcIndivisualProductTotal(){
    let unitPrice=in_pricePerUnit.value
    let quantity=in_unit.value

    return parseFloat(unitPrice)*parseFloat(quantity)
}

function sumTableData(col_index){
    let table=document.getElementById('productTable').getElementsByTagName('tbody')[0]
    let sum=0
    let len=table.rows.length

    for( let i=0; i<len; i++){
        value=parseFloat(table.rows[i].cells[col_index].innerHTML)
        sum=sum+value
    }
    return sum.toFixed(2)
}

function setFinalValue(){
    let payable=in_payable.value
    let discount=in_discount.value
    let paid=in_paid.value
    let due=parseFloat(payable)-(parseFloat(discount)+ parseFloat(paid))
    in_due.value=due.toFixed(2)

    prepareForSendData()
}

function resetSaleForm(){
    in_payable.value=''
    in_discount.value=0
    in_paid.value=0
    in_due.value=''
    select_customer.value=''
    document.getElementById('productTable').getElementsByTagName('tbody')[0].innerHTML=''
}