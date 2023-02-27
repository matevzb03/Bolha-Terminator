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

//checkbox accesser
let checkbox_accesser = new Local_storage_accesser('checkboxes');
checkbox_accesser.get_storage_sync.then((checkbox_result) => {
    
    //removing "yellow" paid ads
    if(checkbox_result.checkboxes.paid_ads_checkbox){
        //removing top of result yellow box
        const ads = document.getElementsByClassName('EntityList--ListItemVauVauAd')
        if(ads.length != 0){
            Array.from(ads).forEach(element => element.remove());
        }
        //removing single paid ads
        const paid_ads = document.getElementsByClassName('EntityList-item--VauVau')
        if(paid_ads.length != 0){
            Array.from(paid_ads).forEach(element => element.remove());
        }
        //removing paid ads from home page
        const super_ads = document.getElementsByClassName('EntityList--ListItemSuperVauAd');
        if(super_ads.length != 0){
            for(const super_ad of super_ads){
                super_ad.remove();
            }
        }
    }
    //removing "yellow" paid ads --end

    //removing ads with keywords
    const ad_space = document.getElementsByClassName('block-standard block-standard--epsilon')[0];
    const articles = ad_space.querySelectorAll("article");

    let ads_removed = 0;
    let ad_storage_accesser = new Local_storage_accesser("ads_removed")
    let keyword_storage_accesser = new Local_storage_accesser("keywords")
    if(articles.length != 0 && (checkbox_result.checkboxes.shop_checkbox || checkbox_result.checkboxes.remove_keywords_checkbox)){
        //get keywords
        let keywords;
        keyword_storage_accesser.get_storage_sync.then((result) => {
            //check if keywords defined otherwise add default
            if(result.keywords == undefined){
                keywords = ["kupim", "odkup", "nakup"];
                keyword_storage_accesser.set_storage_sync = keywords
            }else{
                keywords = result.keywords;
            }
            //check if keywords defined otherwise add default -- end
            
            //loop through all ads
            for(const article of articles){
                //remove ads with given keywords
                if(checkbox_result.checkboxes.remove_keywords_checkbox){
                    let title = article.getElementsByTagName('h3');
                    let title_inner = title[0].innerText.toLowerCase(); //text in title
                    let title_html = title[0].innerHTML.toLowerCase(); //text in html mainly used for links
                
                    if(keywords.some(word => title_inner.includes(word)) || keywords.some(word => title_html.includes(word))){
                        article.remove();
                        ads_removed++;
                        continue;
                    } 
                }
                //remove ads with given keywords -- end

                //remove shops
                if(checkbox_result.checkboxes.shop_checkbox){
                    if(!article.innerHTML.includes("Uporabnik ni trgovec")){
                        article.remove();
                        ads_removed++;
                        continue;
                    }
                }
                //remove shops --end
            }
            
            //all ads removed message
            if(ads_removed == articles.length){
                let logo_pic = chrome.runtime.getURL('images/bolha_logo_150.png');
                document.getElementsByClassName('EntityList-items')[0].innerHTML = `<li class=" EntityList-item EntityList-item--Regular EntityList-item--n24  bp-radix__faux-anchor  " data-href="/samsung/samsung-s23-ultra-512gb-zapakiran-oglas-10650348" data-options="{&quot;hasCompare&quot;:false,&quot;isAdInSavedList&quot;:false,&quot;id&quot;:10650348}">    
                <article class="entity-body cf">
                    <h3 class="entity-title"><a name="10650348" class="link" href="https://github.com/GlitchBoii">Ups, ni oglasov</a></h3>    
                    <div class="entity-thumbnail">
                        <a class="link" href="https://github.com/GlitchBoii">
                            <img class="img entity-thumbnail-img is-loaded" src="${logo_pic}" data-src="${logo_pic}" alt="Bolha Terminator">
                        </a>
                    </div>                  
                    <div class="entity-description">
                        <div class="entity-description-main">
                            <span class="entity-description-itemCaption">Ker bolha očitno priotizira plačane oglase, 'Kupim' oglase ter podjetja, je bil Bolha Terminator prisiljen odstraniti vse oglase na tej strani</span><br>
                            <br>
                            <span class="entity-description-itemCaption">Če se Vam zdi, da je prišlo do napake, poskušajte počistiti filtre</span>
                        </div>
                    </div>      
                    <div class="entity-prices">
                        <ul class="price-items cf">
                            <li class="price-item">
                                <strong class="price price--hrk">
                                    404&nbsp;<span class="currency">€</span>                            
                                </strong>
                            </li>
                        </ul>
                    </div>
                </article>
            </li>`;
            }
            //all ads removed message -- end

            //storing removed ads count in chrome local storage
            ad_storage_accesser.get_storage_sync.then((result) => {
                storage_ads = result.ads_removed;
                if(storage_ads == undefined){
                    storage_ads = 0;
                }
                ads_removed = ads_removed + storage_ads;
                ad_storage_accesser.set_storage_sync = ads_removed;
            });
            //storing removed ads count in chrome local storage -- end

        });//Promise.then() -- end
    }//removing ads with keywords -- end
});//checkbox promise -- end

//removing white space left from removing ads
const ad_space = document.getElementById("adsense_adlist_top_camao");
if(ad_space != null){
    ad_space.remove();
}
