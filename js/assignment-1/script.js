
// alert("working");


function basic(id, room, roomno, price)
{
  // console.log(roomno);
  let room1 = document.getElementById(room);
  let roomnum = document.getElementById(roomno);
  let roomnumber = parseInt(roomnum.innerText);
  let num=parseInt(room1.innerText);
  // console.log(roomnumber);

  if(roomnumber>=5 && id == "pluss")
  {
    alert('One user can book maximum 5 rooms!');
    roomnumber=4;
    num=roomnumber*price;
  }

  if(id=="pluss")
  {
    // console.log("yes");
    num+=price;
    room1.innerText = num;
    roomnum.innerText = roomnumber+1;
  }
  else
  {
    if(num>price)
    {
      num-=price;
      room1.innerText = num;
      roomnum.innerText = roomnumber-1;
    }
    else
    {
      alert("Atleast 1 room must be chosen.")
    }
    
  }
};

function sign(id, package)
{
  // console.log(id);
  let room = document.getElementById(id).innerText;
  let pack = "Basic";
  if(id == "roomnumber2") pack = "Pro";

  let notice = document.getElementById(package);
  notice.style.display = "block";
  notice.innerHTML = `<td style="color:gray;">Thank you for choosing ${room} room with our ${pack} package!</td>`;
}