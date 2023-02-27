//chrome storage accesser class
class Local_storage_accesser{
  constructor(key){
      this.key = key;
  }
  set set_storage_sync(value){
      let obj = {}
      obj[this.key] = value
      chrome.storage.sync.set(obj);
  }
  get get_storage_sync(){
      return chrome.storage.sync.get([this.key])
  }
}
//chrome storage accesser class -- end

//check for enter pressed
const keyword_input_field = document.getElementById("keywords");
keyword_input_field.addEventListener('keypress', e =>{
  if(e.keyCode == 13){//keyCode for enter
    document.getElementById("add_keyword_button").click();
  }
});
//check for enter pressed -- end

//current tab function
async function getCurrentTab(){
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.url
}
//current tab function -- end

//keywords
function update_keywords(){
  const keyword_div = document.getElementById('keyword_container');
  //checking chrome storage
  let keyword_storage_accesser = new Local_storage_accesser("keywords");
  //displaying keywords
  keyword_storage_accesser.get_storage_sync.then((result) => {
    let keywords_div = document.getElementById("keyword_container");
    keywords_div.innerHTML = '';
    let keywords;
    if(result.keywords == undefined){
      keywords = ["kupim", "odkup", "nakup"];
      keyword_storage_accesser.set_storage_sync = keywords
    }else{
      keywords = result.keywords
    }
    for(let keyword of keywords){
      let keywords_div_inner = document.getElementById("keyword_container").innerHTML;
      keywords_div.innerHTML = keywords_div_inner + `
      <div class="keyword">
        <p>${keyword}</p>
        <button id="${keyword}" class="keyword_button">X</button>
      </div>`;
    }
    //displaying keywords -- end 

    //removing keywords
    let keyword_box = keyword_div.querySelectorAll('div');
    for(let keyword of keyword_box){
      let button = keyword.querySelector('button');
      button.addEventListener("click", (event)=>{
        keyword.remove();
        keywords_stored = result.keywords;
        const index = keywords_stored.indexOf(event.target.id);
        if (index > -1) { // only splice array when item is found
          keywords_stored.splice(index, 1); // 2nd parameter means remove one item only
        }
        //updating chrome storage keywords
        keyword_storage_accesser.set_storage_sync = keywords_stored;
      })
    }
    //removing keywords --end 
  });
}
//keywords --end

//run on load
update_keywords();

//adding keywords
const add_keyword_button = document.getElementById("add_keyword_button");
let keyword_storage_accesser = new Local_storage_accesser("keywords");
add_keyword_button.addEventListener("click", () => {
  let keyword_array = keyword_input_field.value.split(";");
  if(keyword_array.length != 0){
    keyword_array = keyword_array.map(item => item.toLowerCase()).filter(item => item != '');
    keyword_storage_accesser.get_storage_sync.then((result) => {
      let keywords_stored = result.keywords;
      //check if item is already in the table
      keyword_array = keyword_array.filter(item => keywords_stored.indexOf(item) == -1);
      //sets updated keyword list 
      keyword_storage_accesser.set_storage_sync = keywords_stored.concat(keyword_array);
      //refreshes everything 
      keyword_input_field.value = '';
      getCurrentTab().then(result => {
        if(result.indexOf('bolha.com') != -1){
          chrome.tabs.reload();
        }
      });
      update_keywords();
    });
  }
});
//adding keywords -- end 

//clearing keywords
const clear_button = document.getElementById('clear_keyword_button');
clear_button.addEventListener("click", () => {
    keyword_storage_accesser.set_storage_sync = [];
    getCurrentTab().then(result => {
      if(result.indexOf('bolha.com') != -1){
        chrome.tabs.reload();
      }
    });
    update_keywords();
  });
//clearing keywords -- end

//checkboxes
const checkbox_storage_accesser = new Local_storage_accesser("checkboxes");

const shop_checkbox = document.getElementById("shops")
const paid_ads_checkbox = document.getElementById("paid_ads")
const remove_keywords_checkbox = document.getElementById("remove_keywords")
const checkboxes = document.querySelectorAll('input[type=checkbox]')

//checking for updates
for(let checkbox of checkboxes){
  checkbox.addEventListener("click", ()=>{
    checkbox_storage_accesser.set_storage_sync = {
      shop_checkbox: shop_checkbox.checked,
      paid_ads_checkbox: paid_ads_checkbox.checked,
      remove_keywords_checkbox: remove_keywords_checkbox.checked
    };
    getCurrentTab().then(result => {
      if(result.indexOf('bolha.com') != -1){
        chrome.tabs.reload();
      }
    });
  })
}
//setting checkboxes
checkbox_storage_accesser.get_storage_sync.then((result) => {
  if(result.checkboxes == undefined){
    checkbox_storage_accesser.set_storage_sync = {
      shop_checkbox: false,
      paid_ads_checkbox: false,
      remove_keywords_checkbox: true
    };
    shop_checkbox.checked = false
    paid_ads_checkbox.checked = false;
    remove_keywords_checkbox.checked = true;
  }else{
    let checkboxes = result.checkboxes;
    shop_checkbox.checked = checkboxes.shop_checkbox;
    paid_ads_checkbox.checked = checkboxes.paid_ads_checkbox;
    remove_keywords_checkbox.checked = checkboxes.remove_keywords_checkbox;
  }
});
//checkboxes --end


//removed ads count
const ads_removed_storage_accesser = new Local_storage_accesser("ads_removed")
const terminirane_bolhe = document.getElementById("ads_removed")

ads_removed_storage_accesser.get_storage_sync.then((result) => {
  ads_removed = result.ads_removed;
  if(ads_removed == undefined){
    ads_removed = 0;
  }
  terminirane_bolhe.innerHTML += `<div class="removed_counter" title="Število Terminiranih Bolh">${ads_removed}</div>`
});
//removed ads count -- end

