// date picker
// $('.datepicker').datepicker();
//  Necessary HTML TAG Initailization
let div_date=document.getElementById('date')
let select_product=document.getElementById('p')
let select_customer=document.getElementById('customer')
let select_paymentType = document.getElementById('paymentType');

let in_id = document.getElementById('id')
let in_pricePerUnit=document.getElementById('pricePerUnit')
let in_unitType =document.getElementById('unitType')
let in_unit=document.getElementById('unit')
let in_price=document.getElementById('price')
let in_costingPrice = document.getElementById('costingPrice')
let in_stock = document.getElementById('stock')
let in_profit = document.getElementById('profit')


let in_payable=document.getElementById('payable')
let in_discount=document.getElementById('discount')
let in_paid=document.getElementById('paid')
let in_due=document.getElementById('due')
let in_shippingCost = document.getElementById('shippingCost')
let div_optional = document.getElementById('optional');


let in_itemId = document.getElementById('itemId')
let in_item=document.getElementById('item')
let in_itemPrice=document.getElementById('itemPrice')
let in_itemUnit=document.getElementById('itemUnit')
let in_itemTotal=document.getElementById('itemTotal')
let in_totalProfit=document.getElementById('totalProfit')


let btn_add=document.getElementById('itemAdd')
let btn_resetItem=document.getElementById('resetItem')
let btn_resetSale=document.getElementById('resetSale')


//Auto total price set
in_unit.addEventListener('keyup',(event)=>{
    let stock = in_stock.value
    if(Number(in_unit.value)>Number(stock)){
        alert(`This product is only ${stock} Unit`)
    }
    let total=calcIndivisualProductTotal()
    let profit = calcIndivisualProfit()
    in_price.value=total
    in_profit.value = profit
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
    let payable=parseFloat(sumTableData(4)) + parseFloat(in_shippingCost.value);
    in_payable.value=payable.toFixed(2)
})

// Add button event listener
let selectedRow=null
btn_add.addEventListener('click',(event)=>{
    let product_item=[]
    if(select_customer.options[select_customer.selectedIndex].value === ""){
        alert('Please Select Customer')
    }
    if(in_id.value !="" && in_unit.value != ""){
        product_item['id']= in_id.value
        product_item['product']=select_product.options[select_product.selectedIndex].text
        product_item['pricePerUnit']=in_pricePerUnit.value
        product_item['unit']=in_unit.value
        product_item['price']=in_price.value
        product_item['profit'] =in_profit.value
        let table=document.getElementById('productTable').getElementsByTagName('tbody')[0]
        let length=table.rows.length
        let item=[];
        for( let i=0; i<length; i++){
            item[i]=table.rows[i].cells[0].innerHTML
        }
        
        if(selectedRow==null && !(item.includes(product_item.id))){
            insertNewRow(product_item)
        }else if(selectedRow==null && (item.includes(product_item.id))){
            alert('Same product Already added')
        }
        else{
            updateRow(product_item)
            btn_add.innerHTML='Add'
            selectedRow=null
        }
        resetProductForm()
        let payable=sumTableData(4) + parseFloat(in_shippingCost.value);
        in_payable.value=payable
        setFinalValue()
    }else{
        alert("Please Select product From Product List")
    }
    
    
})


btn_resetItem.addEventListener('click',(event)=>{
    resetProductForm()
})


btn_resetSale.addEventListener('click',(event)=>{
    resetSaleForm()
})

select_product.addEventListener('change',(event)=>{
    let {id,price,unittype,costingprice,stock}=select_product.options[select_product.selectedIndex].dataset;
    in_costingPrice.value=costingprice
    in_stock.value = stock
    in_pricePerUnit.value=price
    in_unitType.value='/'+unittype
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


function insertNewRow(data){
    let table=document.getElementById('productTable').getElementsByTagName('tbody')[0]
    let newRow=table.insertRow(table.rows.length)

    let cell1=newRow.insertCell(0)
    let cell2=newRow.insertCell(1)
    let cell3=newRow.insertCell(2)
    let cell4=newRow.insertCell(3)
    let cell5=newRow.insertCell(4)
    let cell6=newRow.insertCell(5)
    let cell7=newRow.insertCell(6)

    cell1.className="align-middle text-left"
    cell2.className="align-middle text-left"
    cell3.className="align-middle text-right"
    cell4.className="align-middle text-right"
    cell5.className="align-middle text-right"
    cell6.className="align-middle text-right"
    cell7.className="d-none"

    cell1.innerHTML=data['id']
    cell2.innerHTML=data['product']
    cell3.innerHTML=data['pricePerUnit']
    cell4.innerHTML=data['unit']
    cell5.innerHTML=data['price']
    cell6.innerHTML=`<a class="btn btn-sm btn-white edit-btn mr-1" onClick="onEdit(this)"><i class="material-icons md-14 align-middle">edit</i></a>
                    <a class="btn btn-sm btn-danger" onClick="onDelete(this)"><i class="material-icons md-14 align-middle">delete</i></a>`;
    cell7.innerHTML = data['profit']
}

function updateRow(data){
    selectedRow.cells[0].innerHTML=data['id']
    selectedRow.cells[1].innerHTML=data['product']
    selectedRow.cells[2].innerHTML=data['pricePerUnit']
    selectedRow.cells[3].innerHTML=data['unit']
    selectedRow.cells[4].innerHTML=data['price']
    selectedRow.cells[6].innerHTML=data['profit']
}

function onEdit(td){
    selectedRow=td.parentElement.parentElement

    let id= selectedRow.cells[0].innerHTML
    let product=selectedRow.cells[1].innerHTML
    let pricePerUnit=selectedRow.cells[2].innerHTML
    let unit=selectedRow.cells[3].innerHTML
    let price=selectedRow.cells[4].innerHTML
    let profit=selectedRow.cells[6].innerHTML
    let costingPrice = parseFloat(profit)/parseFloat(unit) - parseFloat(pricePerUnit)

    in_id.value= id.trim()
    select_product.selectedIndex=[...select_product.options].findIndex(option=> option.text.trim() == product.trim())
    in_pricePerUnit.value=pricePerUnit.trim()
    in_unit.value=unit.trim()
    in_price.value=price.trim()
    in_profit.value = profit.trim()
    in_costingPrice.value = costingPrice
    btn_add.innerHTML='Update'
}

function onDelete(td){
    let row=td.parentElement.parentElement
    document.getElementById('productTable').getElementsByTagName('tbody')[0].deleteRow(row.rowIndex-1)
    let payable=sumTableData(4)
    let totalProfit = sumTableData(6)
    in_totalProfit.value = totalProfit
    in_payable.value=payable
    prepareForSendData()
}

function prepareForSendData(){
    let profit=[]
    let id =[]
    let item=[]
    let itemPrice=[]
    let itemUnit=[]
    let itemTotal=[]
    let table=document.getElementById('productTable').getElementsByTagName('tbody')[0]
    let length=table.rows.length
    for( let i=0; i<length; i++){
        id[i]=table.rows[i].cells[0].innerHTML
        item[i]=table.rows[i].cells[1].innerHTML
        itemPrice[i]=table.rows[i].cells[2].innerHTML
        itemUnit[i]=table.rows[i].cells[3].innerHTML
        itemTotal[i]=table.rows[i].cells[4].innerHTML
        profit[i]=table.rows[i].cells[6].innerHTML
    }
    in_itemId.value=id
    in_item.value=item
    in_itemPrice.value=itemPrice
    in_itemUnit.value=itemUnit
    in_itemTotal.value=itemTotal
    in_totalProfit.value = profit
}

function resetProductForm(){
    in_unitType.value=''
    in_id.value= ''
    select_product.value=''
    in_pricePerUnit.value=''
    in_unit.value=''
    in_price.value=''
    in_profit.value = ''
    in_stock.value = ''
    in_costingPrice.value = ''
}

function calcIndivisualProductTotal(){
    let unitPrice=in_pricePerUnit.value
    let quantity=in_unit.value

    return parseFloat(unitPrice)*parseFloat(quantity)
}
function calcIndivisualProfit(){
    let costingPrice = in_costingPrice.value
    let price = in_pricePerUnit.value
    let quantity =in_unit.value
    return (parseFloat(price)-parseFloat(costingPrice))*parseFloat(quantity)
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