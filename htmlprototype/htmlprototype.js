/******************************************

      Collections (Data Objects)

  *******************************************/
assets = new Meteor.Collection("Assets"); // Designs
// designs.insert({name: "I Heart", url: "http://image10.spreadshirt.net/image-server/v1/compositions/5617609/views/1,width=235,height=235,appearanceId=1/Weiss-I-Heart-T-Shirt.jpg", description: "Ich und mein Herz, uns trennt niemand!", tags: ["love", "Liebe", "Herz", "heart"], format: "vector"});
tags = new Meteor.Collection("Tags");
countries = new Meteor.Collection("Countries");
shops = new Meteor.Collection("Shops");
products = new Meteor.Collection("Products");
designs = new Meteor.Collection("Designs");
colors = new Meteor.Collection("Colors");


if (Meteor.isClient) {


  // add all client-facing behavior here

  /******************************************

      Session Variables

  *******************************************/

  // We are declaring the 'adding_category' flag
  Session.set('adding_category', false);
  Session.set('editing_tag_id');
  Session.set('new_tag', false);
  
  // filter variables
  Session.set('tag_filters');
  Session.set('status_filters_labels', []);
  Session.set('design_filters', []);

  Session.set('product_filters', []);

  Session.set('bulk_create_design_names', []);

  Session.set('status_filters_values', []);
  Session.set('status_filters_singleOrMultiValue', []);

  // We are declaring the 'adding_category' flag
  Session.set('adding_asset', false);
  Session.set('editing_asset', '');
  // Session.set('selected_assets');
  Session.set('selected_assets', []);
  Session.set('showGLobalTags', false);
  
  Session.set('newAssetPublishedPublished', false);
  Session.set('newAssetIsApproved', false);

  Session.set('assetgridview', true);
  Session.set('zeroStateAddTag', false);
  Session.set('showAssortment', false);
  Session.set('showAssets', true);
  Session.set('showFilters', false);
  Session.set('showDesigns', false);

  Session.set('editing_design', false);
  Session.set('editing_product', '');

  Session.set('bulk_creating_products', false);

  Session.set('sorting', 'az');

  Session.set('publishstatus_filter', 'All');
  Session.set('notification_message', '');
  Session.set('status_applied', '');

  Session.set('assets_zero_state', true);


  /******************************************

      Template Variables Helper Functions
      
  *******************************************/
  // Template: zeroStateAddTag

  Template.zeroStateAddTag.zeroStateAddTag = function (e,t) {
    return Session.get('zeroStateAddTag');
  }

  // Template: bulk_create_products

  Template.bulk_create_products.designs = function () {
    return designs.find({});
  }

  Template.bulk_create_products.tags = function () {
    return tags.find({});
  }

  Template.bulk_create_products.products_global = function () {
    return products.find({region: 'Global'},{sort: {name: 1}});
  }

  Template.bulk_create_products.products_na = function () {
    return products.find({region: 'NA'},{sort: {name: 1}});
  }

  Template.bulk_create_products.products_eu = function () {
    return products.find({region: 'EU'},{sort: {name: 1}});
  }

  Template.bulk_create_products.bulk_creating_products = function () {
    return Session.get('bulk_creating_products');
  }  

  Template.bulk_create_products.bulk_create_design_name = function () {
    var selected_designs = Session.get('bulk_create_design_names', []);
    var the_name = "";
    for(i=0;i<selected_designs.length;i++) {
      if(i == 0) {
        the_name += String(selected_designs[i]);
      } else if (i == 1) {
        the_name += " (" + String(selected_designs[i]);
      } else {
        the_name += ", " + String(selected_designs[i]);
      }
    }
    if (selected_designs.length > 1) {
        the_name += ")";
    }
    return the_name;
  }

  // Template: designs

  Template.designs.showDesigns = function (e,t) {
    return Session.get('showDesigns');
  }

  Template.designs.designs = function (e,t) {
    return designs.find({},{sort: {'name': 1}});
  }

  Template.designs.design_id = function (e,t) {
    return designs.find({},{sort: {'name': 1}});
  }

  Template.designs.editing_design = function (e,t) {
    return Session.get('editing_design');
  }

  // Template: Tag

  Template.tag.edit_tag = function (e,t) {
    var is_this_editable = false;
    var local_tag_id = Session.get('editing_tag_id');
    
    if ((this)._id == local_tag_id) {
      is_this_editable = true;
    }
    
    return is_this_editable;
  };

  // Template: Tags

  Template.tags.new_tag = function (e,t) {
    return Session.get('new_tag');
  };

  Template.tags.tags = function () {
    return tags.find({},{sort: {'tag': 1}});
  };

  Template.tags.showGLobalTags = function() {
    return Session.get('showGLobalTags');
  };

  // Template: Assets

  Template.assets.showAssets = function() {
    return Session.get('showAssets');
  };

  Template.assets.assets = function () {
    var sort_value = Session.get('sorting');
    if(sort_value == 'az') {
      return assets.find({},{sort: {name: 1}});
    } else if (sort_value == 'za') {
      return assets.find({},{sort: {name: -1}});
    } else if (sort_value == 'recent') {
      return assets.find({},{sort: {date: -1}});
    } else if (sort_value == 'date') {
      return assets.find({},{sort: {date: 1}});
    } else {
      return assets.find({},{sort: {name: 1}});
    }
  };

  Template.assets.tags = function () {
    return tags.find({},{sort: {'tag': 1}});
  };

  // This returns true if adding_category has been assigned a value of true
  Template.assets.new_edit_asset = function () {
    return Session.equals('adding_asset', true);
  };

  Template.assets.assets_zero_state = function () {
    var designfilters = Session.get('design_filters');
    var productfilters = Session.get('product_filters');
    if(designfilters.length + productfilters.length > 0) {
      Session.set('assets_zero_state', false);
    }

    return Session.get('assets_zero_state');
  };

  Template.assets.product_url = function () {
    var the_id = Session.get('editing_asset');
    return products.findOne({'_id': the_id}).resources.href;
  };

  Template.assets.designs = function () {
    var the_id = Session.get('editing_asset');
    var the_designs = assets.findOne({'_id': the_id}).designs;
    return the_designs;
  };

  Template.assets.design_url = function () {
    var the_id = this._id;
    var the_url = designs.findOne({'_id': the_id}).url;
    return the_url;
  };

  Template.assets.newAssetIsPublished = function(e,t) {
    // document.getElementById('newAssetPublishedPublished').checked;
    return Session.get('newAssetPublishedPublished');
  };

  Template.assets.newAssetIsApproved = function(e,t) {
    return Session.get('newAssetIsApproved');
  };  

  Template.assets.countries = function() {
    return countries.find({});
  };

  Template.assets.newAssetId = function () {
    var searchvalue = Session.get('editing_asset');
    if(searchvalue != '') {
      return searchvalue;
    }
  };

  Template.assets.editAssetName = function () {
    var searchvalue = Session.get('editing_asset');
    if(searchvalue != '') {
      return assets.findOne({'_id': searchvalue}).name;
    }
  };

  Template.assets.editAssetUrl = function () {
    var searchvalue = Session.get('editing_asset');
    if(searchvalue != '') {
      return assets.findOne({'_id': searchvalue}).url;
    }
  };

  Template.assets.newAssetDescription = function () {
    var searchvalue = Session.get('editing_asset');
    if(searchvalue != '') {
      return assets.findOne({'_id': searchvalue}).description;
    }
  };

  Template.assets.newAssetVector = function () {
    var searchvalue = Session.get('editing_asset');
    if(searchvalue != '') {
      if(assets.findOne({'_id': searchvalue}).fileformat == 'vector')
      return "checked";
    }
  };

  Template.assets.newAssetBitmap = function () {
    var searchvalue = Session.get('editing_asset');
    if(searchvalue != '') {
      if(assets.findOne({'_id': searchvalue}).fileformat == 'bitmap')
      return "checked";
    }
  };

  Template.assets.newAssetUnused = function () {
    var searchvalue = Session.get('editing_asset');
    if(searchvalue != '') {
      if(assets.findOne({'_id': searchvalue}).usage == 'unused')
      return "checked";
    }
  };

  Template.assets.newAssetUsed = function () {
    var searchvalue = Session.get('editing_asset');
    if(searchvalue != '') {
      if(assets.findOne({'_id': searchvalue}).usage == 'used')
      return "checked";
    }
  };

  Template.assets.newAssetUnpublished = function () {
    var searchvalue = Session.get('editing_asset');
    if(searchvalue != '') {
      if(assets.findOne({'_id': searchvalue}).published == 'unpublished') {
        return "checked";
      }
    }
  };

  Template.assets.newAssetPublished = function () {
    var searchvalue = Session.get('editing_asset');
    if(searchvalue != '') {
      if(assets.findOne({'_id': searchvalue}).published == 'published') {
        Session.set('newAssetPublishedPublished', true);
        return "checked";  
      }
    }
  };

  Template.assets.newAssetNotReviewed = function () {
    var searchvalue = Session.get('editing_asset');
    if(searchvalue != '') {
      if(assets.findOne({'_id': searchvalue}).review == 'not reviewed')
      return "checked";
    }
  };

  Template.assets.newAssetInReview = function () {
    var searchvalue = Session.get('editing_asset');
    if(searchvalue != '') {
      if(assets.findOne({'_id': searchvalue}).review == 'in review')
      return "checked";
    }
  };

  Template.assets.newAssetReviewedNotApproved = function () {
    var searchvalue = Session.get('editing_asset');
    if(searchvalue != '') {
      if(assets.findOne({'_id': searchvalue}).review == 'reviewed not approved')
      return "checked";
    }
  };

  Template.assets.newAssetReviewedApproved = function () {
    var searchvalue = Session.get('editing_asset');
    if(searchvalue != '') {
      if(assets.findOne({'_id': searchvalue}).review == 'reviewed approved') {
        Session.set('newAssetIsApproved', true);
        return "checked";
      }
    }
  };

  Template.assets.newAssetTagSelection = function () {
    var searchvalue = Session.get('editing_asset');
    var existing_tags = assets.findOne({'_id': searchvalue}).appliedtags;
    for(i=0;i<existing_tags.length;i++){
      if(this._id == existing_tags[i]) {
        return "checked";
      }
    }
  };

  Template.assets.newAssetDesignSelection = function () {
    var searchvalue = Session.get('editing_asset');
    var existing_designs = assets.findOne({'_id': searchvalue}).designs;
    for(i=0;i<existing_designs.length;i++){
      if(this._id == existing_designs[i]) {
        return "checked";
      }
    }
  };

  Template.assets.newAssetPublishedCountries = function () {
    var searchvalue = Session.get('editing_asset');
    var existing_countries = assets.findOne({'_id': searchvalue}).publishedcountries;
    for(i=0;i<existing_countries.length;i++){
      if(this._id == existing_countries[i]) {
        return "checked";
      }
    }
  };

  Template.assets.assetFilterApprovalCountries = function () {
    var searchvalue = Session.get('editing_asset');
    var existing_countries = assets.findOne({'_id': searchvalue}).approvedForPOS;
    for(i=0;i<existing_countries.length;i++){
      if(this._id == existing_countries[i]) {
        return "checked";
      }
    }
  };

  Template.assets.newAssetPublishedShops = function () {
    var searchvalue = Session.get('editing_asset');
    var existing_shops = assets.findOne({'_id': searchvalue}).publishedshops;
    for(i=0;i<existing_shops.length;i++){
      if(this._id == existing_shops[i]) {
        return "checked";
      }
    }
  };

  Template.assets.newAssetProduct = function () {
    var searchvalue = Session.get('editing_asset');
    if(searchvalue != '') {
      var the_id = assets.findOne({'_id': searchvalue}).product;
      if(this._id == the_id) {
        return "selected";
      }
    }
  };

  Template.assets.POS_MP_Country = function () {
    return countries.find({}, {sort: {'country': 1}});
  };



  Template.assets.assetgridview = function () {
    return Session.get('assetgridview');
  };

  Template.assets.shops = function() {
    return shops.find({}, {sort: {'shop': 1}});
  };

  Template.assets.products = function () {
    return products.find({}, {sort: {'name': 1}});
  };

  Template.assets.designs = function () {
    return designs.find({}, {sort: {'name': 1}});
  };

  Template.assets.editing_asset = function () {
    var assetID = Session.get('editing_asset');
    if(assetID != "") {
      return true;
    }
  };

  Template.assets.zero_state_product_url = function () {
    // only display it if there is an actual product created with it
    var the_id = this._id;
    var the_assets = assets.findOne({designs: the_id});
    var the_product = products.findOne({_id: the_assets.product});
    return the_product.resources.href;
  };

  Template.assets.design_in_assets = function () {
    // only display it if there is an actual product created with it
    var the_id = this._id;
    var all_assets = assets.findOne({designs: the_id});

    if(all_assets != null) {
      return true;
    } else {
      return false;
    }
  };

  Template.assets.single_or_multiple = function () {
    var the_id = this._id;
    var all_assets = assets.find({designs: the_id}).count();    
    if(all_assets == 1) {
      return "zero_state_single";
    } else {
      return "zero_state_multiple";
    }
  };  

  Template.assets.number_of_products = function () {
    var the_id = this._id;
    var number = assets.find({designs: the_id}).count();
    if(number == 1) {
      return  number + " product";    
    } else {
      return  number + " products";    
    }
    
  };

  // Template: SingleTag

  Template.singletag.the_tag = function () {
    // the ID returns as an Array of characters
    var the_id_array = (this);
    
    // create a string variable that will contain the assembled characters
    var the_id = "";
    for(i=0;i<the_id_array.length;i++){
      the_id += the_id_array[i];
    }
    // query the tag object for the id in question and read it's tag name 
    var the_tag_name = tags.findOne({'_id': the_id}, {'ObjectId': the_id}).tag;
    return the_tag_name;
    
  };


  // Template: Asset

  Template.asset.assetnotfiltered = function () {    
    var the_tags = this.appliedtags;
    var the_filters = Session.get('tag_filters');
    var match = 0;
    if(typeof the_filters !== 'undefined' && the_filters.length > -1) {
      for(i=0;i<the_tags.length;i++) {
        for(j=0;j<the_filters.length;j++) {
          if(the_tags[i] == the_filters[j]) {
            match++;
          } 
        }
      }

      if(match == the_filters.length) {
        return true;    
      } else {
        return false;  
      }
      
    } else {
      return true;
    }
    

    // return true;  
  };

  Template.asset.assetnotfilteredbydesign = function () {    
    var the_designs = this.designs;
    var the_filters = Session.get('design_filters');
    var match = 0;
    if(typeof the_filters !== 'undefined' && the_filters.length > -1) {
      for(i=0;i<the_designs.length;i++) {
        for(j=0;j<the_filters.length;j++) {
          if(the_designs[i] == the_filters[j]) {
            match++;
          } 
        }
      }

      if(match == the_filters.length) {
        return true;    
      } else {
        return false;  
      }
      
    } else {
      return true;
    }
    

    // return true;  
  };

  Template.asset.assetnotfilteredbyproduct_men = function () {    
    var the_product = this.product;
    
    var the_filters_NA = Session.get('NA_product_filters_men');
    var the_filters_EU = Session.get('EU_product_filters_men');
    var the_filters_Global = Session.get('Global_product_filters_men');

    var the_filters = [];
    the_filters.push(the_filters_NA);
    the_filters.push(the_filters_EU);
    the_filters.push(the_filters_Global);
    console.log('the_filters: ' + the_filters);

    var match = 0;
    if(typeof the_filters !== 'undefined' && the_filters.length > -1) {
      for(j=0;j<the_filters.length;j++) {
        if(the_product == the_filters[j]) {
          match++;
        } 
      }

      if(match == the_filters.length) {
        return true;    
      } else {
        return false;  
      }
      
    } else {
      return true;
    } 
  };

  Template.asset.assetnotfilteredbyproduct_women = function () {    
    var the_product = this.product;
    var the_filters_NA = Session.get('NA_product_filters_women');
    var the_filters_EU = Session.get('EU_product_filters_women');
    var the_filters_Global = Session.get('Global_product_filters_women');

    var the_filters = [];
    the_filters.push(the_filters_NA);
    the_filters.push(the_filters_EU);
    the_filters.push(the_filters_Global);

    var match = 0;
    if(typeof the_filters !== 'undefined' && the_filters.length > -1) {
      for(j=0;j<the_filters.length;j++) {
        if(the_product == the_filters[j]) {
          match++;
        } 
      }

      if(match == the_filters.length) {
        return true;    
      } else {
        return false;  
      }
      
    } else {
      return true;
    } 
  };

  Template.asset.assetnotfilteredbyproduct_kids = function () {    
    var the_product = this.product;
    var the_filters_NA = Session.get('NA_product_filters_kids');
    var the_filters_EU = Session.get('EU_product_filters_kids');
    var the_filters_Global = Session.get('Global_product_filters_kids');

    var the_filters = [];
    the_filters.push(the_filters_NA);
    the_filters.push(the_filters_EU);
    the_filters.push(the_filters_Global);
    
    var match = 0;
    if(typeof the_filters !== 'undefined' && the_filters.length > -1) {
      for(j=0;j<the_filters.length;j++) {
        if(the_product == the_filters[j]) {
          match++;
        } 
      }

      if(match == the_filters.length) {
        return true;    
      } else {
        return false;  
      }
      
    } else {
      return true;
    } 
  };

  Template.asset.assetnotfilteredbyproduct_accessories = function () {    
    var the_product = this.product;
    var the_filters_NA = Session.get('NA_product_filters_accessories');
    var the_filters_EU = Session.get('EU_product_filters_accessories');
    var the_filters_Global = Session.get('Global_product_filters_accessories');

    var the_filters = [];
    the_filters.push(the_filters_NA);
    the_filters.push(the_filters_EU);
    the_filters.push(the_filters_Global);
    
    var match = 0;
    if(typeof the_filters !== 'undefined' && the_filters.length > -1) {
      for(j=0;j<the_filters.length;j++) {
        if(the_product == the_filters[j]) {
          match++;
        } 
      }

      if(match == the_filters.length) {
        return true;    
      } else {
        return false;  
      }
      
    } else {
      return true;
    } 
  };

  Template.asset.assetnotfilteredbyproduct_cases = function () {    
    var the_product = this.product;
    var the_filters_NA = Session.get('NA_product_filters_cases');
    var the_filters_EU = Session.get('EU_product_filters_cases');
    var the_filters_Global = Session.get('Global_product_filters_cases');

    var the_filters = [];
    the_filters.push(the_filters_NA);
    the_filters.push(the_filters_EU);
    the_filters.push(the_filters_Global);
    
    var match = 0;
    if(typeof the_filters !== 'undefined' && the_filters.length > -1) {
      for(j=0;j<the_filters.length;j++) {
        if(the_product == the_filters[j]) {
          match++;
        } 
      }

      if(match == the_filters.length) {
        return true;    
      } else {
        return false;  
      }
      
    } else {
      return true;
    } 
  };

  Template.asset.assetnotfilteredbystatus = function () {
    var the_labels = Session.get('status_filters_labels');
    var the_values = Session.get('status_filters_values');
    var the_quantity = Session.get('status_filters_singleOrMultiValue');

    var match = 0;

    if(the_labels.length >= 0){
      for(i=0;i<the_labels.length;i++){
        if(the_quantity[i] == 'single') {
          // single value fields
          if(this[the_labels[i]] == the_values[i]) {
            match++;
          } 
        } else {
          // multi value fields
          var the_multivalue_field = this[the_labels[i]];
          for(j=0;j<the_multivalue_field.length; j++) {
            if(the_multivalue_field[j] == the_values[i]) {
              match++;
            } 
          }
        } 
      }

      if(match == the_labels.length) {
          return true;    
      } else {
          return false;  
      }
      
    } else {
      return true;
    }
  };

  Template.asset.assetnotfilteredbyproduct = function () {
    var the_product = this.product;
    var products = Session.get('product_filters');

    var match = 0;

    if(typeof products !== 'undefined' && products.length > 0) {
      for(i=0;i<products.length;i++) {
        if(products[i] == the_product) {
          match++;
        }
      }

      if(match > 0) {
        return true;    
      } else {
        return false;  
      }
    } else {
      return true;
    }
  };

  Template.asset.id = function () {
    return this.id;
  };

  Template.asset.assetgridview = function () {
    return Session.get('assetgridview');
  };

  Template.asset.product_url = function () {
    var the_id = this.product;
    return products.findOne({'_id': the_id}).resources.href;
  };

  Template.asset.firstdesign = function () {
    var the_designs = (this).designs;
    var the_first = the_designs[0];
    var the_url = designs.findOne({_id: the_first}).url;
    return the_url;
  };

  Template.asset.is_asset_selected = function () {
    var selected_assets = Session.get('selected_assets');
    for(i=0;i<selected_assets.length;i++) {
      console.log(this._id + ' — ' +  selected_assets[i]);
      if(this._id == selected_assets[i]) {
        return "selected";
      }
    }
  };

  Template.asset.is_asset_checked = function () {
    var selected_assets = Session.get('selected_assets');
    for(i=0;i<selected_assets.length;i++) {
      console.log(this._id + ' — ' +  selected_assets[i]);
      if(this._id == selected_assets[i]) {
        return "checked";
      }
    }
  };

  Template.asset.is_asset_selected_listview = function () {
    var selected_assets = Session.get('selected_assets');
    for(i=0;i<selected_assets.length;i++) {
      console.log(this._id + ' — ' +  selected_assets[i]);
      if(this._id == selected_assets[i]) {
        return "selected";
      }
    }
  };

  // Template.asset.designs = function () {
  //   return (this).designs;
  // }

  Template.asset.design_url = function () {
    var the_id = String(this);
    return designs.findOne({'_id': the_id}).url;
  };

  Template.asset.assetnotfilteredbypublishstatus = function() {
    var the_filter = Session.get('publishstatus_filter');
    var this_products_status = this.status;
    console.log('publishstatus_filter: ' + the_filter);
    console.log('this.status: ' + this.status);
    if(the_filter == 'All') {
      return true;
    } else {
      if(the_filter == this_products_status) {
        return true;
      } else {
        return false;
      }
    }
    
  };

  // Template: AssetFilters

  Template.assetFilters.showFilters = function () {
    if(Session.get('showAssortment') == true || Session.get('showAssets') == true) {
      Session.set('showFilters', true);
    } else {
      Session.set('showFilters', false);
    }
    return Session.get('showFilters');
  };



  // Template: designFiltersListed

  Template.designFiltersListed.designs = function () {
    return designs.find({}, {sort: {'name': 1}});
  };

  Template.designFiltersListed.design_in_assets = function () {
    // only display it if there is an actual product created with it
    var the_id = this._id;
    var all_assets = assets.findOne({designs: the_id});

    if(all_assets != null) {
      return true;
    } else {
      return false;
    }
  };

    // Template: productFiltersListed_GLobal

  Template.productFiltersListed_Global.global_products = function () {
    return products.find({region: 'Global'}, {sort: {'Name': 1}});
  };

  Template.productFiltersListed_Global.product_in_assets = function () {
    // only display it if there is an actual product created with it
    var the_id = this._id;
    var all_assets = assets.findOne({product: the_id});

    if(all_assets != null) {
      return true;
    } else {
      return false;
    }
  };


    // Template: productFiltersListed_NA

  Template.productFiltersListed_NA.NA_mens = function () {
    return products.find({region: 'NA', category: 'Men'}, {sort: {'NAme': 1}});
  };

  Template.productFiltersListed_NA.mens_product_in_assets = function () {
    // only display it if there is an actual product created with it
    var the_id = this._id;
    var all_assets = assets.findOne({product: the_id});

    if(all_assets != null) {
      return true;
    } else {
      return false;
    }
  };

  Template.productFiltersListed_NA.NA_womens = function () {
    return products.find({region: 'NA', category: 'Women'}, {sort: {'NAme': 1}});
  };

  Template.productFiltersListed_NA.womens_product_in_assets = function () {
    // only display it if there is an actual product created with it
    var the_id = this._id;
    var all_assets = assets.findOne({product: the_id});

    if(all_assets != null) {
      return true;
    } else {
      return false;
    }
  };

  Template.productFiltersListed_NA.NA_kids = function () {
    return products.find({region: 'NA', category: 'Kids & Babies'}, {sort: {'NAme': 1}});
  };

  Template.productFiltersListed_NA.kids_product_in_assets = function () {
    // only display it if there is an actual product created with it
    var the_id = this._id;
    var all_assets = assets.findOne({product: the_id});

    if(all_assets != null) {
      return true;
    } else {
      return false;
    }
  };

  Template.productFiltersListed_NA.NA_accessories = function () {
    return products.find({region: 'NA', category: 'Accessories'}, {sort: {'NAme': 1}});
  };

  Template.productFiltersListed_NA.accessories_product_in_assets = function () {
    // only display it if there is an actual product created with it
    var the_id = this._id;
    var all_assets = assets.findOne({product: the_id});

    if(all_assets != null) {
      return true;
    } else {
      return false;
    }
  };

  Template.productFiltersListed_NA.NA_cases = function () {
    return products.find({region: 'NA', category: 'Cases'}, {sort: {'NAme': 1}});
  };

  Template.productFiltersListed_NA.cases_product_in_assets = function () {
    // only display it if there is an actual product created with it
    var the_id = this._id;
    var all_assets = assets.findOne({product: the_id});

    if(all_assets != null) {
      return true;
    } else {
      return false;
    }
  };

  Template.productFiltersListed_NA.NA_productfilter_men_all_selectionstatus = function () {
    var appliedtags = Session.get('NA_product_filters_men');
    var number_of_assortment_in_category = products.find({region: 'NA', category: 'Men'}).count();

    if(appliedtags.length == number_of_assortment_in_category) {
      return "deselect all";
    } else {
      return "select all";
    }
  };

  Template.productFiltersListed_NA.NA_productfilter_women_all_selectionstatus = function () {
    var appliedtags = Session.get('NA_product_filters_women');
    var number_of_assortment_in_category = products.find({region: 'NA', category: 'Women'}).count();

    if(appliedtags.length == number_of_assortment_in_category) {
      return "deselect all";
    } else {
      return "select all";
    }
  };

  Template.productFiltersListed_NA.NA_productfilter_kids_all_selectionstatus = function () {
    var appliedtags = Session.get('NA_product_filters_kids');
    var number_of_assortment_in_category = products.find({region: 'NA', category: 'Children & Babies'}).count();

    if(appliedtags.length == number_of_assortment_in_category) {
      return "deselect all";
    } else {
      return "select all";
    }
  };

  Template.productFiltersListed_NA.NA_productfilter_accessories_all_selectionstatus = function () {
    var appliedtags = Session.get('NA_product_filters_accessories');
    var number_of_assortment_in_category = products.find({region: 'NA', category: 'Accessories'}).count();

    if(appliedtags.length == number_of_assortment_in_category) {
      return "deselect all";
    } else {
      return "select all";
    }
  };

  Template.productFiltersListed_NA.NA_productfilter_cases_all_selectionstatus = function () {
    var appliedtags = Session.get('NA_product_filters_cases');
    var number_of_assortment_in_category = products.find({region: 'NA', category: 'Cases'}).count();

    if(appliedtags.length == number_of_assortment_in_category) {
      return "deselect all";
    } else {
      return "select all";
    }
  };

  // Template: productFiltersListed_EU

  Template.productFiltersListed_EU.EU_mens = function () {
    return products.find({region: 'EU', category: 'Men'}, {sort: {'EUme': 1}});
  };

  Template.productFiltersListed_EU.mens_product_in_assets = function () {
    // only display it if there is an actual product created with it
    var the_id = this._id;
    var all_assets = assets.findOne({product: the_id});

    if(all_assets != null) {
      return true;
    } else {
      return false;
    }
  };

  Template.productFiltersListed_EU.EU_womens = function () {
    return products.find({region: 'EU', category: 'Women'}, {sort: {'EUme': 1}});
  };

  Template.productFiltersListed_EU.womens_product_in_assets = function () {
    // only display it if there is an actual product created with it
    var the_id = this._id;
    var all_assets = assets.findOne({product: the_id});

    if(all_assets != null) {
      return true;
    } else {
      return false;
    }
  };

  Template.productFiltersListed_EU.EU_kids = function () {
    return products.find({region: 'EU', category: 'Kids & Babies'}, {sort: {'EUme': 1}});
  };

  Template.productFiltersListed_EU.kids_product_in_assets = function () {
    // only display it if there is an actual product created with it
    var the_id = this._id;
    var all_assets = assets.findOne({product: the_id});

    if(all_assets != null) {
      return true;
    } else {
      return false;
    }
  };

  Template.productFiltersListed_EU.EU_accessories = function () {
    return products.find({region: 'EU', category: 'Accessories'}, {sort: {'EUme': 1}});
  };

  Template.productFiltersListed_EU.accessories_product_in_assets = function () {
    // only display it if there is an actual product created with it
    var the_id = this._id;
    var all_assets = assets.findOne({product: the_id});

    if(all_assets != null) {
      return true;
    } else {
      return false;
    }
  };

  Template.productFiltersListed_EU.EU_cases = function () {
    return products.find({region: 'EU', category: 'Cases'}, {sort: {'EUme': 1}});
  };

  Template.productFiltersListed_EU.cases_product_in_assets = function () {
    // only display it if there is an actual product created with it
    var the_id = this._id;
    var all_assets = assets.findOne({product: the_id});

    if(all_assets != null) {
      return true;
    } else {
      return false;
    }
  };

  Template.productFiltersListed_EU.EU_productfilter_men_all_selectionstatus = function () {
    var appliedtags = Session.get('EU_product_filters_men');
    var number_of_assortment_in_category = products.find({region: 'EU', category: 'Men'}).count();

    if(appliedtags.length == number_of_assortment_in_category) {
      return "deselect all";
    } else {
      return "select all";
    }
  };

  Template.productFiltersListed_EU.EU_productfilter_women_all_selectionstatus = function () {
    var appliedtags = Session.get('EU_product_filters_women');
    var number_of_assortment_in_category = products.find({region: 'EU', category: 'Women'}).count();

    if(appliedtags.length == number_of_assortment_in_category) {
      return "deselect all";
    } else {
      return "select all";
    }
  };

  Template.productFiltersListed_EU.EU_productfilter_kids_all_selectionstatus = function () {
    var appliedtags = Session.get('EU_product_filters_kids');
    var number_of_assortment_in_category = products.find({region: 'EU', category: 'Children & Babies'}).count();

    if(appliedtags.length == number_of_assortment_in_category) {
      return "deselect all";
    } else {
      return "select all";
    }
  };

  Template.productFiltersListed_EU.EU_productfilter_accessories_all_selectionstatus = function () {
    var appliedtags = Session.get('EU_product_filters_accessories');
    var number_of_assortment_in_category = products.find({region: 'EU', category: 'Accessories'}).count();

    if(appliedtags.length == number_of_assortment_in_category) {
      return "deselect all";
    } else {
      return "select all";
    }
  };

  Template.productFiltersListed_EU.EU_productfilter_cases_all_selectionstatus = function () {
    var appliedtags = Session.get('EU_product_filters_cases');
    var number_of_assortment_in_category = products.find({region: 'EU', category: 'Cases'}).count();

    if(appliedtags.length == number_of_assortment_in_category) {
      return "deselect all";
    } else {
      return "select all";
    }
  };

  // Template: AssetFilterTags

  Template.assetFiltersTags.assetFiltersTags = function () {
    return tags.find({}, {sort: {'tag': 1}});
  };

  // Template: assetFilterApprovalCountries

  Template.approved_for_POS_filter.assetFilterApprovalCountries = function () {
    return countries.find({}, {sort: {'country': 1}});
  };

  // Template: assetFiltersStatuses

  Template.assetFiltersStatuses.assetFilterApprovalShops = function () {
    return shops.find({}, {sort: {'shop': 1}});
  };


  // Template: Assortment
  Template.assortment.showAssortment = function () {
    return Session.get('showAssortment');
  };

  Template.assortment.products = function () {
    return products.find({}, {sort: {'name': 1}});
  };

  Template.assortment.commission = function () {
    var the_price = this.price.vatExcluded;
    the_price *= 0.12;
    the_price = the_price.toFixed(2);
    return the_price;
  };

  Template.assortment.editing_product = function(e,t) {
    var is_this_editable = false;
    var the_product_id = Session.get('editing_product');
    if((this)._id == the_product_id) {
      is_this_editable = true;
    }
    return is_this_editable;
  };

  Template.assortment.product_category_men_selected = function() {
    if((this).category == "Men") {
      return "selected";
    }
  };

  Template.assortment.product_category_women_selected = function() {
    if((this).category == "Women") {
      return "selected";
    }
  };

  Template.assortment.product_category_kids_selected = function() {
    if((this).category == "Kids & Babies") {
      return "selected";
    }
  };

  Template.assortment.product_category_accessories_selected = function() {
    if((this).category == "Accessories") {
      return "selected";
    }
  };

  Template.assortment.product_category_cases_selected = function() {
    if((this).category == "Cases") {
      return "selected";
    }
  };

  Template.assortment.colors = function () {
    return colors.find({}, {sort: {'color': 1}});
  };

  Template.assortment.colortagselection = function () {
    var the_product = Session.get('editing_product');
    var applied_colors = products.findOne({'_id': the_product}).colors;
    // console.log(applied_colors);
    for(i=0;i<applied_colors.length;i++){
      // console.log(applied_colors[i]);
      if(this._id == applied_colors[i]) {
        return "checked";
      }
    }
  };

  // Template: appliedFilters

  Template.appliedFilters.filters_are_applied = function() {
    var designfilters = Session.get('design_filters');
    var productfilters = Session.get('product_filters');
    if(designfilters.length + productfilters.length > 0) {
      return true;
    } else {
      // Session.set('assets_zero_state', true);
    }

  }

  Template.appliedFilters.designfilters = function() {
    return Session.get('design_filters');
  };

  Template.appliedFilters.product_filters = function() {
    return Session.get('product_filters');
  };

  Template.appliedFilters.url = function() {
    var the_id = String(this);
    var the_design = designs.findOne({_id: the_id}).url;
    return the_design;
  };

  Template.appliedFilters.product = function() {
    var the_id = String(this);
    var the_product = products.findOne({_id: the_id}).name;
    return the_product;
  };

  Template.appliedFilters.region = function() {
    var the_id = String(this);
    var the_region = products.findOne({_id: the_id}).region;
    return the_region;
  };


  // Template: notifications

  Template.notifications.assets_are_selected = function () {
    var selected_assets = Session.get('selected_assets');
    if(selected_assets.length > 0) {
      return true;
    }
  };

  Template.notifications.number_of_selected_assets = function() {
    return Session.get('selected_assets').length;
  };

  Template.notifications.notification_message = function() {
    return Session.get('notification_message');
  };

  Template.notifications.notification_review = function() {
    var the_status = Session.get('status_applied');
    if(the_status == "In Review") {
      return true;
    }
  };

  Template.notifications.notification_publish = function() {
    var the_status = Session.get('status_applied');
    if(the_status == "Published") {
      return true;
    }
  };

  Template.notifications.notification_unpublish = function() {
    var the_status = Session.get('status_applied');
    if(the_status == "Unpublished") {
      return true;
    }
  };

  Template.notifications.notification_delete = function() {
    var the_status = Session.get('status_applied');
    if(the_status == "Deleted") {
      return true;
    }
  };


  // Template: bulkactions

  Template.bulkactions.isonlyoneproductselected = function() {
    var selected_assets = Session.get('selected_assets');
    if(selected_assets.length == 1) {
      return "";
    } else {
      return "disabled";
    }
  };









  /******************************************

      Template Events Helper Functions
      
  *******************************************/

  // Template: bulkactions

  Template.bulkactions.events({
    'click #bulkaction_submit': function(e,t) {
      var the_action = document.getElementById('bulkaction_selection').value;
      var the_assets = Session.get('selected_assets');

      if(the_action == 'edit_metadata') { alert('You could now bulk edit the metadata of ' + the_assets.length + ' products.'); }
      else if(the_action == 'edit_design') { alert('This would open ' + the_assets.length + ' products in the designer tool.'); }
      else if(the_action == 'create_similar') { alert('This would open the designer tool with the same designs and allow you to quickly create a similar product.'); }
      else if(the_action == 'replace_design') { alert('This would open an interface allowing you to update or replace the designs on the selected products'); }
      else if(the_action == 'add_design') { alert('This would open an interface allowing you to add a new design to the selected products. This could be used to quickly add your logo to the back of a number of tshirts.'); }
      else if(the_action == 'submit_review') {
        for(i=0;i<the_assets.length; i++) {
          assets.update({'_id': the_assets[i]}, {$set: {
            status: "In Review"
          }});
        }
        Session.set('notification_message', the_assets.length + ' products successfully submitted for review.');
        Session.set('status_applied', "In Review");
      }
      else if(the_action == 'publish') {
        for(i=0;i<the_assets.length; i++) {
          assets.update({'_id': the_assets[i]}, {$set: {
            status: "Published"
          }});
        }
        Session.set('notification_message', the_assets.length + ' products successfully published.');
        Session.set('status_applied', "Published");
      }
      else if(the_action == 'unpublish') {
        for(i=0;i<the_assets.length; i++) {
          assets.update({'_id': the_assets[i]}, {$set: {
            status: "Unpublished"
          }});
        }
        Session.set('notification_message', the_assets.length + ' products successfully unpublished.');
        Session.set('status_applied', "Unpublished");
      }
      else if(the_action == 'delete') {
        for(i=0;i<the_assets.length; i++) {
          assets.remove({'_id': the_assets[i]});
        }
        Session.set('notification_message', the_assets.length + ' products successfully deleted.');
        Session.set('status_applied', "Deleted");
      }
      else if(the_action == 'reject') {
        for(i=0;i<the_assets.length; i++) {
          assets.update({'_id': the_assets[i]}, {$set: {
            status: "Rejected"
          }});
        }
        Session.set('notification_message', the_assets.length + ' products successfully rejected. :-(');
        Session.set('status_applied', "Rejected");
      }
      else if(the_action == 'approve') {
        for(i=0;i<the_assets.length; i++) {
          assets.update({'_id': the_assets[i]}, {$set: {
            status: "Approved"
          }});
        }
        Session.set('notification_message', the_assets.length + ' products successfully rejected. :-(');
        Session.set('status_applied', "Approved");
      }
      deselectAll();
    }
  });


  // Template bulk_create_products

  Template.bulk_create_products.events({
    'click #bulk_create_products': function(e,t) {
      Session.set('bulk_creating_products', true);
      console.log('bulk create');
      console.log(Session.get('bulk_creating_products'));
    },

    'click .bulk_create_design': function(e,t) {
      var bulk_create_design_names = Session.get('bulk_create_design_names');
      var the_name = e.currentTarget.getAttribute('data-name');
      bulk_create_design_names.push(the_name);
      Session.set('bulk_create_design_names', bulk_create_design_names);

      var thevar = Session.get('bulk_create_design_names');
      console.log(thevar);
    },

    'click #bulk_create_products_submit': function(e,t) {
      var the_products = [];
      var allProducts = document.getElementsByClassName('bulk_create_product_selection');
      console.log(allProducts.length);
      for (var i = allProducts.length - 1; i >= 0; i--) {
        if(allProducts[i].checked) {
          var the_selected_product = allProducts[i].getAttribute('value');
          the_products.push(the_selected_product);
        }
      };
      console.log('products: ' + the_products);

      var the_tags = [];
      var allTags = document.getElementsByClassName('bulk_create_tag');
      console.log(allTags.length);
      for (var i = allTags.length - 1; i >= 0; i--) {
        if(allTags[i].checked) {
          var the_selected_tag = allTags[i].getAttribute('value');
          the_tags.push(the_selected_tag);
        }
      };
      console.log('tags: ' + the_tags);

      var the_designs = [];
      var allDesigns = document.getElementsByClassName('bulk_create_design');
      console.log(allDesigns.length);
      for (var i = allDesigns.length - 1; i >= 0; i--) {
        if(allDesigns[i].checked) {
          var the_selected_design = allDesigns[i].getAttribute('value');
          the_designs.push(the_selected_design);
        }
      };
      console.log('designs: ' + the_designs);

      var the_name = document.getElementById('bulk_create_name').value;
      var the_description = document.getElementById('bulk_create_description').value;
      console.log('name: ' + the_name);

      var the_date = new Date;

      for(i=0; i<the_products.length;i++) {
        assets.insert({
          name: the_name,
          description: the_description,
          appliedtags: the_tags,
          designs: the_designs,
          product: the_products[i],
          date: the_date
        });
      }
    }
  });

  // Template: zeroStateAddTag
  Template.zeroStateAddTag.events({
    'click #zeroStateAddTag_new_tag_save': function(e,t) {
      var value = String(document.getElementById('zeroStateAddTag_new_tag_name').value);
      if (value) {
        tags.insert({'tag':value});
        Session.set('zeroStateAddTag', false);
      } 
    }
  });

  // Template: Assortment

  Template.assortment.events({
    'click .product': function(e,t) {
      Session.set('editing_product', this._id);
      var this_product = e.currentTarget;
      $(e.currentTarget).removeClass('product').addClass('editing_product');
    },
    'click #cancel_product': function(e,t) {
      $(e.currentTarget).parent().parent().removeClass('editing_product').addClass('product');
      Session.set('editing_product', '');
    },
    'click #save_product': function(e,t) {
      var colors = [];
      var allColors = document.getElementsByClassName('colortag');
      for (var i = allColors.length - 1; i >= 0; i--) {
        if(allColors[i].checked) {
          var the_color = allColors[i].getAttribute('value');
          colors.push(the_color);
        }
      };

      var the_selector = document.getElementById('product_category');
      var the_category = the_selector.options[the_selector.selectedIndex].value;
      var the_id = document.getElementById('product_id').value;

      products.update({'_id': the_id}, {$set: {
        category: the_category,
        colors: colors
      }});

      $(e.currentTarget).parent().parent().removeClass('editing_product').addClass('product');
      Session.set('editing_product', '');
    }
  });

  // Template: Designs

  Template.designs.events({
    'click #design_save': function(e,t) {
      var the_design_name = String(document.getElementById('design_name').value);
      var the_design_url = String(document.getElementById('design_url').value);
      var the_design_id = String(document.getElementById('design_id').value);
      
      if(Session.get('editing_design')) {
        designs.update({'_id': the_design_id}, {$set: {
          name:the_design_name, 
          url:the_design_url
        }});
      } else {
        designs.insert({
          name:the_design_name, 
          url:the_design_url
        });
      }

      exit_design_edit_mode();
    },

    'click .the_design': function(e,t) {
      Session.set('editing_design', true);
      document.getElementById('design_id').value = this._id;
      document.getElementById('design_name').value = this.name;
      document.getElementById('design_url').value = this.url;
    },

    'click #design_delete': function(e,t) {
      var the_design_id = String(document.getElementById('design_id').value);
      designs.remove({'_id': the_design_id});
      exit_design_edit_mode();
    }
  });

function exit_design_edit_mode() {
  Session.set('editing_design', false);
  document.getElementById('design_id').value = '';
  document.getElementById('design_name').value = '';
  document.getElementById('design_url').value = '';
}

  // Template: Tags

  Template.tags.events({
    'click #tag_add_new': function(e,t) {
      Session.set('new_tag', true);
    },
    'click #tag_new_tag_save': function(e,t) {
      var value = String(document.getElementById('tag_new_tag_name').value);
      if (value) {
        tags.insert({'tag':value});
        Session.set('new_tag', false);
      } 
    }
  });

  // Template: Tag

  Template.tag.events({
    'click .tag': function (e,t) {
      // enter tag editing mode by specifying the id of the tag to edit
      Session.set('editing_tag_id', (this._id));
      Meteor.flush();
      focusText(t.find("input.tag"));
    },
    'click #tag_edit_cancel': function (e,t) {
      // cancel out of editing mode by emptying the variable key
      cancelTagEditingMode();
    },
    'click #tag_edit_save': function (e,t) {
      var value = String(document.getElementById('tag_edit_value').value);
      if (value) {
        tags.update({'_id': this._id}, {$set: {'tag':value}});
        cancelTagEditingMode();
      }   
    },
    'click #tag_edit_delete': function (e,t) {
      tags.remove({'_id': this._id});  
      cancelTagEditingMode();
    },
    'keyup .tag': function (e,t) {
      if (e.which === 13) {
        var value = String(e.target.value || "");
        if (value) {
          tags.update({'_id': this._id}, {$set: {'tag':value}});
          cancelTagEditingMode();
        }     
      }
    }
  });

  // Template: Nav

  Template.nav.events({
    'click .nav_item': function (e,t) {
      // var all_nav_variable_names = new Array;
      removeActiveClassFromNavItems();

      var all_nav_variables = document.getElementsByClassName('nav_item');
      for(i=0;i<all_nav_variables.length;i++) {
        var this_value = all_nav_variables[i].getAttribute('data-variable'); 
        // all_nav_variable_names.push(this_value);
        if(this_value == e.currentTarget.getAttribute('data-variable')) {
          Session.set(this_value, true);
          e.currentTarget.className += " active";
        } else {
          Session.set(this_value, false);
        }
      }
    },
    'click #nav_assets': function (e,t) {
      if(assets.find().count() < 1) {
        Session.set('adding_asset', true);
      }
    }
  });

  // Template: designFilters

  Template.designFiltersListed.events({
    'click .designfilter': function (e,t) {
      Meteor.flush();
      var thisDesignIsChecked = e.currentTarget.checked;
      console.log(thisDesignIsChecked);
      
      var t = Session.get('design_filters');
      t = _.extend([], t);
      
      if(thisDesignIsChecked) {
        console.log(this._id);
        t.push(this._id);
      } else {
        var index = t.indexOf(this._id);
        if(index > -1) {
          t.splice(index, 1); 
        }
      }
      Session.set('design_filters', t);
      console.log(Session.get('design_filters'));
    },
    'click #apply_design_filters': function (e,t) {
      console.log('success');
    }
  });

  // Template: productFiltersListed_GLobal

  Template.productFiltersListed_Global.events({
    'click .productfilter': function(e,t) {
      Meteor.flush();
      var thisProductIsChecked = e.currentTarget.checked;
      var t = Session.get('product_filters');
      t = _.extend([], t);
      
      if(thisProductIsChecked) {
        console.log(this._id);
        t.push(this._id);
      } else {
        var index = t.indexOf(this._id);
        if(index > -1) {
          t.splice(index, 1); 
        }
      }
      Session.set('product_filters', t);
      console.log('product filters: ' + Session.get('product_filters'));
    }
  });

  // Template: productFiltersListed_NA

  Template.productFiltersListed_EU.events({
    'click .productfilter': function(e,t) {
      Meteor.flush();
      var thisProductIsChecked = e.currentTarget.checked;
      var t = Session.get('product_filters');
      t = _.extend([], t);
      
      if(thisProductIsChecked) {
        console.log(this._id);
        t.push(this._id);
      } else {
        var index = t.indexOf(this._id);
        if(index > -1) {
          t.splice(index, 1); 
        }
      }
      Session.set('product_filters', t);
      console.log('product filters: ' + Session.get('product_filters'));
    }
  });

  // Template: productFiltersListed_NA

  Template.productFiltersListed_NA.events({
    'click .productfilter': function(e,t) {
      Meteor.flush();
      var thisProductIsChecked = e.currentTarget.checked;
      var t = Session.get('product_filters');
      t = _.extend([], t);
      
      if(thisProductIsChecked) {
        console.log(this._id);
        t.push(this._id);
      } else {
        var index = t.indexOf(this._id);
        if(index > -1) {
          t.splice(index, 1); 
        }
      }
      Session.set('product_filters', t);
      console.log('product filters: ' + Session.get('product_filters'));
    },

    'click .productfilter_all': function (e,t) {
      var session_variable = e.currentTarget.getAttribute('data-sessionvariable');
      var targetclass = e.currentTarget.getAttribute('data-targetclass');
      var is_selected = e.currentTarget.checked;
      console.log(session_variable);
      console.log(targetclass);

      //select all
      var appliedtags = Session.get('NA_product_filters_cases');
      var number_of_assortment_in_category = products.find({category: 'Cases'}).count();

      var t = Session.get(session_variable);
      t = [];
      // if all are selected
      if(!is_selected) {
        // deselect all
        console.log("deselect all");
        $('.'+targetclass).each(function() {
          $(this).prop('checked', false);  
        });
      } else {
        console.log("select all");
        $('.'+targetclass).each(function() {
          $(this).prop('checked', true);
          var this_id = $(this).attr('value');
          t.push(this_id);
        }); 
      }    

      Session.set(session_variable, t);  

      console.log(Session.get(session_variable));
    }
  });

  // Template: AssetFilterTags

  Template.assetFiltersTags.events({
    'click .assetFiltersTag': function (e,t) {
      Meteor.flush();
      var thisTagIsChecked = e.currentTarget.checked;
      
      var t = Session.get('tag_filters');
      t = _.extend([], t);
      
      if(thisTagIsChecked) {
        t.push(this._id);
      } else {
        var index = t.indexOf(this._id);
        if(index > -1) {
          t.splice(index, 1); 
        }
      }
      Session.set('tag_filters', t);
    }
  });

  // Template: AssetFilterStatuses

  Template.assetFiltersStatuses.events({
    'click .assetFiltersTag': function (e,t) {
      Meteor.flush();
      var thisFilterIsChecked = e.currentTarget.checked;
      
      var t = Session.get('status_filters_labels');
      var u = Session.get('status_filters_values');
      var v = Session.get('status_filters_singleOrMultiValue');
      t = _.extend([], t);
      u = _.extend([], u);
      v = _.extend([], v);
      
      if(thisFilterIsChecked) {
        var the_label = e.currentTarget.getAttribute('data-label');
        var the_value = e.currentTarget.getAttribute('data-value');
        var the_quantity = e.currentTarget.getAttribute('data-singleOrMultiValue');
        t.push(the_label);
        u.push(the_value);
        v.push(the_quantity);
      } else {
        var t_index = t.indexOf(the_label);
        t.splice(t_index, 1); 
        u.splice(t_index, 1);  
        v.splice(t_index, 1);   
      }
      Session.set('status_filters_labels', t);
      Session.set('status_filters_values', u);
      Session.set('status_filters_singleOrMultiValue', v);
    }
  });

  
  Template.delete_products.events({
    'click #delete_products': function (e,t) {
      Meteor.call('removeAllProducts');
    },
    'click #delete_colors': function (e,t) {
      Meteor.call('removeAllColors');
    },
    'click #delete_designs': function (e,t) {
      Meteor.call('removeAllDesigns');
    },
    'click #delete_assets': function (e,t) {
      Meteor.call('removeAllAssets');
    }
  });

  // Template: Assets

  Template.assets.events({
    'click #btnNewAsset': function (e,t) {
      // Session.set('editing_asset', '');
      Session.set('adding_asset', true);
      Session.set('editing_asset', '');
      Meteor.flush();
      focusText(t.find("#newAssetName"));
    },
    'click #btnSaveAsset': function (e,t) {
      var newAssetId = String(document.getElementById('newAssetId').value || "");
      var newAssetName = String(document.getElementById('newAssetName').value || "");
      var newAssetUrl = String(document.getElementById('newAssetUrl').value || "");
      var newAssetDescription = String(document.getElementById('newAssetDescription').value || "");

      var newAssetTags = [];
      var allTags = document.getElementsByClassName('newAssetTag');
      for (var i = allTags.length - 1; i >= 0; i--) {
        if(allTags[i].checked) {
          var the_tag = allTags[i].getAttribute('value');
          newAssetTags.push(the_tag);
        }
      };

      var newAssetDesigns = [];
      var allDesigns = document.getElementsByClassName('newAssetDesign');
      for (var i = allDesigns.length - 1; i >= 0; i--) {
        if(allDesigns[i].checked) {
          var the_design = allDesigns[i].getAttribute('value');
          newAssetDesigns.push(the_design);
        }
      };

      var newAssetPublishedCountries = [];
      var allCountries = document.getElementsByClassName('newAssetPublishedCountry');
      for (var i = allCountries.length - 1; i >= 0; i--) {
        if(allCountries[i].checked) {
          var the_country = allCountries[i].getAttribute('value');
          newAssetPublishedCountries.push(the_country);
        }
      };

      var newAssetPublishedShops = [];
      var allShops = document.getElementsByClassName('newAssetPublishedShop');
      for (var i = allShops.length - 1; i >= 0; i--) {
        if(allShops[i].checked) {
          var the_shop = allShops[i].getAttribute('value');
          newAssetPublishedShops.push(the_shop);
        }
      };

      var newAssetPOS_MP_Countries = [];
      var allApprovedCountries = document.getElementsByClassName('newAssetApprovedForPOS');
      for (var i = allApprovedCountries.length - 1; i >= 0; i--) {
        if(allApprovedCountries[i].checked) {
          var the_approved_country = allApprovedCountries[i].getAttribute('value');
          newAssetPOS_MP_Countries.push(the_approved_country);
        }
      };

      var newAssetFileFormat = $('input[name="newAssetFileFormat"]:checked').val();
      var newAssetUsage = $('input[name="newAssetUsage"]:checked').val();
      var newAssetPublished = $('input[name="newAssetPublished"]:checked').val();
      var newAssetReview = $('input[name="newAssetReview"]:checked').val();
      var newAssetProduct = $('#newAssetProduct').val();

      if(newAssetId != '') {
        assets.update({'_id': newAssetId}, {$set: {
          name: newAssetName,
          url: newAssetUrl,
          description: newAssetDescription,
          appliedtags: newAssetTags,
          designs: newAssetDesigns,
          fileformat: newAssetFileFormat,
          usage: newAssetUsage,
          published: newAssetPublished,
          publishedcountries: newAssetPublishedCountries,
          publishedshops: newAssetPublishedShops,
          review: newAssetReview,
          approvedForPOS: newAssetPOS_MP_Countries,
          product: newAssetProduct
        }});
        
      } else {
        assets.insert({
          name: newAssetName,
          url: newAssetUrl,
          description: newAssetDescription,
          appliedtags: newAssetTags,
          designs: newAssetDesigns,
          fileformat: newAssetFileFormat,
          usage: newAssetUsage,
          published: newAssetPublished,
          publishedcountries: newAssetPublishedCountries,
          publishedshops: newAssetPublishedShops,
          review: newAssetReview,
          approvedForPOS: newAssetPOS_MP_Countries,
          product: newAssetProduct
        });
      }

      Session.set('adding_asset', false);
    },

    'click #btnDeleteAsset': function(e,t) {
      var the_asset_id = String(document.getElementById('newAssetId').value);
      assets.remove({'_id': the_asset_id});
      Session.set('adding_asset', false);
    },
    'click #btnCancelAsset': function (e,t) {
      Session.set('editing_asset', '');
      Session.set('adding_asset', false);
    },
    'click #newAssetPublishedPublished': function(e,t) {
      console.log("published");
      Session.set('newAssetPublishedPublished', true);
    },
    'click #newAssetPublishedUnpublished': function(e,t) {
      console.log("unpublished");
      Session.set('newAssetPublishedPublished', false);
    },
    'click [name=newAssetReview]': function(e,t) {
      if(e.currentTarget.id == 'newAssetReviewReviewedApproved') {
        console.log("approved");
        Session.set('newAssetIsApproved', true);  
      } else {
        Session.set('newAssetIsApproved', false);  
      }
      
    },
    'click #assetgridview': function(e,t) {
      Session.set('assetgridview', true);
    },
    'click #assetlistview': function(e,t) {
      Session.set('assetgridview', false);
    },
    'click #sort_assets_apply': function(e,t) {
      var the_value = document.getElementById('sort_assets').value;
      Session.set('sorting', the_value);
      console.log(the_value);
    },

    'click #show_assets_by_status': function(e,t) {
      var the_value = document.getElementById('assets_status').value;
      Session.set('publishstatus_filter', the_value);
    },

    'click #assets_select_all': function(e,t) {
      if(e.currentTarget.checked) {
        selectAll();
      } else {
        deselectAll();
      }
    },

    'click .zerostate_asset': function(e,t) {
      var the_id = e.currentTarget.id;
      var design_filters = Session.get('design_filters');
      design_filters.push(the_id);
      Session.set('design_filters', design_filters);
      Session.set('assets_zero_state', false);
    }

  });

  // Template: Asset

  Template.asset.events({
    'click .asset_selector': function(e,t) {
      // Session.set('selected_assets', this._id);
      var the_asset = e.currentTarget;
      var the_id = the_asset.getAttribute('name');
      $('#' + the_id).toggleClass('selected');

      var is_this_selected = the_asset.checked;
      console.log(is_this_selected);
      

      var t = Session.get('selected_assets');
      t = _.extend([], t);
      
      if(is_this_selected) {
        t.push(the_id);
      } else {
        var index = t.indexOf(the_id);
        if(index > -1) {
          t.splice(index, 1); 
        }
      }
      Session.set('selected_assets', t);

      var number_of_selected_asstes = Session.get('selected_assets');
      console.log(number_of_selected_asstes.length);
    },
    'click .flexigrid-item': function(e,t) {
      // Session.set('selected_assets', this._id);
      var the_asset = e.currentTarget;
      var the_id = the_asset.id;
      $('#' + the_id).toggleClass('selected');

      var is_this_selected = $(the_asset).hasClass('selected');
      console.log(is_this_selected);
      

      var t = Session.get('selected_assets');
      t = _.extend([], t);
      
      if(is_this_selected) {
        t.push(the_id);
      } else {
        var index = t.indexOf(the_id);
        if(index > -1) {
          t.splice(index, 1); 
        }
      }
      Session.set('selected_assets', t);

      var number_of_selected_asstes = Session.get('selected_assets');
      console.log(number_of_selected_asstes.length);
      
    },

    'click .edit_asset_button': function(e,t) {
      Session.set('editing_asset', this._id);
      Session.set('adding_asset', true);
    }

  });


  // Template: appliedFilters

  Template.appliedFilters.events({
    'click .removefilter': function(e,t) {
      var session_variable = e.currentTarget.getAttribute('data-sessionvariable');
      var the_id = e.currentTarget.getAttribute('data-id');
      
      var t = Session.get(session_variable);
      t = _.extend([], t);
      
      var index = t.indexOf(the_id);
      if(index > -1) {
        t.splice(index, 1); 
      }
      Session.set(session_variable, t);
    }
  });


   /******************************************

      Other Functions
      
  *******************************************/

  function cancelTagEditingMode() {
    Session.set('editing_tag_id', '');
  };
  
  function removeActiveClassFromNavItems() {
    // resets classes on nav items to the default "nav_item" and thus removes all "active" classes
    var nav_items = document.getElementsByClassName('nav_item');      
    for(i=0;i<nav_items.length; i++) {
      nav_items[i].className = "nav_item";
    }
  };
  
  //this function puts our cursor where it needs to be.
  function focusText(i) {
    i.focus();
    i.select();
  };

  function selectAll() {
    var the_ids = [];
    var gridview = Session.get('assetgridview');
    if(gridview) {
      $('.flexigrid-item').each(function() {
        $(this).addClass('selected');
        var this_id = $(this).attr('id');
        the_ids.push(this_id);
      });
    } else {
      $('.tablecontainer tr').each(function() {
        $(this).addClass('selected');
        var this_id = $(this).attr('id');
        the_ids.push(this_id);
      });
    }
    
    Session.set('selected_assets', the_ids);
  }

  function deselectAll() {
    $('.flexigrid-item').each(function() {
      $(this).removeClass('selected');
    });
    Session.set('selected_assets', []);
  }

}

if (Meteor.isServer) {
  Meteor.startup(function () {

    // code to run on server at startup
      var products_count = products.find().count();
      if(products_count < 1){

// US Products

          products.insert({
    "region" : "NA",             
    "category" : "Men", 
    "name" : "Men\u0027s Premium T-Shirt",
    "manufacturingCountry" : {
      "id" : "94",
      "href" : "http://api.spreadshirt.com/api/v1/countries/94"},
      "price" : {
        "vatExcluded":10.90,
        "vatIncluded":10.90,
        "vat":0.00,
        "currency" : {
          "id" : "3",
          "href" : "http://api.spreadshirt.com/api/v1/currencies/3"
          }
      },
      "resources" : {
        "mediaType" : "png",
        "type" : "preview",
        "href" : "http://image.spreadshirt.com/image-server/v1/productTypes/812/views/1/appearances/2"
      },
      "id" : "812",
        "href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/812"
    });

products.insert({"region" : "NA", "category" : "Women", "name" : "Women’s Premium T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.com/api/v1/countries/94"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/813/views/1/appearances/506"},"id" : "813","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/813"});

products.insert({"region" : "NA", "category" : "Kids & Babies", "name" : "Kid\u0027s Premium T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.com/api/v1/countries/94"},"price" : {"vatExcluded":8.90,"vatIncluded":8.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/815/views/1/appearances/231"},"id" : "815","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/815"});

products.insert({"region" : "NA", "category" : "Kids & Babies", "name" : "Toddler Premium T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.com/api/v1/countries/94"},"price" : {"vatExcluded":8.90,"vatIncluded":8.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/814/views/1/appearances/366"},"id" : "814","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/814"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men’s Premium Tank Top","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.com/api/v1/countries/94"},"price" : {"vatExcluded":12.90,"vatIncluded":12.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/916/views/1/appearances/231"},"id" : "916","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/916"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women’s Premium Tank Top","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.com/api/v1/countries/94"},"price" : {"vatExcluded":12.90,"vatIncluded":12.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/917/views/1/appearances/506"},"id" : "917","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/917"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Hooded Sweatshirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":26.30,"vatIncluded":26.30,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/405/views/2/appearances/196"},"id" : "405","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/405"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men’s Performance T-Shirt","manufacturingCountry" : {"id" : "79","href" : "http://api.spreadshirt.com/api/v1/countries/79"},"price" : {"vatExcluded":14.90,"vatIncluded":14.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/953/views/1/appearances/33"},"id" : "953","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/953"});

products.insert({"region" : "NA", "category" : "Kids & Babies", "name" : "Kids\u0027 Hooded Sweatshirt","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.com/api/v1/countries/124"},"price" : {"vatExcluded":17.90,"vatIncluded":17.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/499/views/2/appearances/370"},"id" : "499","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/499"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Unisex Camouflage T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":12.90,"vatIncluded":12.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/922/views/1/appearances/162"},"id" : "922","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/922"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Performance T-Shirt","manufacturingCountry" : {"id" : "79","href" : "http://api.spreadshirt.com/api/v1/countries/79"},"price" : {"vatExcluded":14.90,"vatIncluded":14.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/954/views/1/appearances/412"},"id" : "954","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/954"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Tote Bag","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":8.50,"vatIncluded":8.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/842/views/1/appearances/2"},"id" : "842","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/842"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Shot Glass","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":3.50,"vatIncluded":3.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/915/views/1/appearances/1"},"id" : "915","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/915"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s T-Shirt","manufacturingCountry" : {"id" : "79","href" : "http://api.spreadshirt.com/api/v1/countries/79"},"price" : {"vatExcluded":6.50,"vatIncluded":6.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/210/views/1/appearances/63"},"id" : "210","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/210"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":6.50,"vatIncluded":6.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/347/views/1/appearances/164"},"id" : "347","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/347"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "iPhone 4/4S Premium Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/869/views/1/appearances/1"},"id" : "869","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/869"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "iPhone 5/5S Premium Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/870/views/1/appearances/1"},"id" : "870","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/870"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "Samsung Galaxy S3 Premium Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/871/views/1/appearances/1"},"id" : "871","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/871"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "Samsung Galaxy S4 Premium Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/872/views/1/appearances/1"},"id" : "872","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/872"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "Samsung Galaxy S5 Premium Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/947/views/1/appearances/1"},"id" : "947","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/947"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Slim Fit T-Shirt by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":14.20,"vatIncluded":14.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/288/views/1/appearances/92"},"id" : "288","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/288"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s T-Shirt by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":14.20,"vatIncluded":14.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/175/views/1/appearances/203"},"id" : "175","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/175"});

products.insert({"region" : "NA", "category" : "Kids & Babies", "name" : "Baby T-Romper","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":11.90,"vatIncluded":11.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/820/views/1/appearances/504"},"id" : "820","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/820"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Adult Apron","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.com/api/v1/countries/102"},"price" : {"vatExcluded":13.10,"vatIncluded":13.10,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/158/views/1/appearances/360"},"id" : "158","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/158"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Leggings by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":17.90,"vatIncluded":17.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/925/views/3/appearances/504"},"id" : "925","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/925"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Contrast Coffee Mug","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/268/views/3/appearances/71"},"id" : "268","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/268"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "iPhone 5/5S Hard Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/782/views/1/appearances/533"},"id" : "782","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/782"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "iPhone 5C Rubber Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/910/views/1/appearances/70"},"id" : "910","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/910"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Tri-Blend Performance T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":19.50,"vatIncluded":19.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/838/views/1/appearances/228"},"id" : "838","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/838"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Hooded Sweatshirt","manufacturingCountry" : {"id" : "84","href" : "http://api.spreadshirt.com/api/v1/countries/84"},"price" : {"vatExcluded":26.30,"vatIncluded":26.30,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/111/views/2/appearances/22"},"id" : "111","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/111"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Tri-Blend Performance T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":19.50,"vatIncluded":19.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/837/views/1/appearances/519"},"id" : "837","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/837"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Snap-back Baseball Cap","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.com/api/v1/countries/94"},"price" : {"vatExcluded":14.90,"vatIncluded":14.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/803/views/1/appearances/548"},"id" : "803","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/803"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "iPhone 5/5S Rubber Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/822/views/1/appearances/70"},"id" : "822","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/822"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women’s French Terry Zip Hoodie","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.com/api/v1/countries/124"},"price" : {"vatExcluded":37.50,"vatIncluded":37.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/926/views/1/appearances/556"},"id" : "926","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/926"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women’s Cropped Boxy T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":15.50,"vatIncluded":15.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/946/views/1/appearances/2"},"id" : "946","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/946"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Shot Glasses (set of 4)","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":11.90,"vatIncluded":11.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/921/views/1/appearances/1"},"id" : "921","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/921"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Tri-Blend Performance Hooded T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":27.50,"vatIncluded":27.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/839/views/1/appearances/519"},"id" : "839","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/839"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Frosted Glass Beer Mug","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":12.90,"vatIncluded":12.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/826/views/3/appearances/509"},"id" : "826","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/826"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Unisex Fleece Zip Hoodie by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":34.70,"vatIncluded":34.70,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/669/views/2/appearances/448"},"id" : "669","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/669"});

products.insert({"region" : "NA", "category" : "Kids & Babies", "name" : "Baby Long Sleeve One Piece","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.com/api/v1/countries/102"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/342/views/1/appearances/1"},"id" : "342","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/342"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Womens Wideneck Sweatshirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":31.80,"vatIncluded":31.80,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/681/views/1/appearances/450"},"id" : "681","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/681"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Long Sleeve T-Shirt by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":18.60,"vatIncluded":18.60,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/174/views/1/appearances/231"},"id" : "174","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/174"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s V-Neck T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.com/api/v1/countries/94"},"price" : {"vatExcluded":12.00,"vatIncluded":12.00,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/348/views/1/appearances/194"},"id" : "348","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/348"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Flowy Tank Top by Bella","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":15.30,"vatIncluded":15.30,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/752/views/1/appearances/412"},"id" : "752","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/752"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Coffee/Tea Mug","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":6.90,"vatIncluded":6.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/31/views/1/appearances/1"},"id" : "31","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/31"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Longer Length Fitted Tank","manufacturingCountry" : {"id" : "79","href" : "http://api.spreadshirt.com/api/v1/countries/79"},"price" : {"vatExcluded":12.00,"vatIncluded":12.00,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/469/views/1/appearances/142"},"id" : "469","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/469"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Flip-Flops","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":15.50,"vatIncluded":15.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/846/views/1/appearances/70"},"id" : "846","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/846"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "Samsung Galaxy S5 Rubber Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/948/views/1/appearances/70"},"id" : "948","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/948"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Teddy Bear","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":14.90,"vatIncluded":14.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/909/views/1/appearances/1"},"id" : "909","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/909"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Travel Mug","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":11.90,"vatIncluded":11.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/773/views/3/appearances/1"},"id" : "773","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/773"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Ringer T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":13.10,"vatIncluded":13.10,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/216/views/1/appearances/70"},"id" : "216","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/216"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Umbrella","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":14.20,"vatIncluded":14.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/55/views/1/appearances/5"},"id" : "55","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/55"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Long Sleeve Jersey T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":13.10,"vatIncluded":13.10,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/345/views/1/appearances/18"},"id" : "345","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/345"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Blanket","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":25.20,"vatIncluded":25.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/609/views/1/appearances/5"},"id" : "609","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/609"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Pillowcase","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":9.90,"vatIncluded":9.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/914/views/1/appearances/1"},"id" : "914","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/914"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Crewneck Sweatshirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":19.70,"vatIncluded":19.70,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/512/views/1/appearances/231"},"id" : "512","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/512"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Baseball Cap","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":12.00,"vatIncluded":12.00,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/129/views/1/appearances/5"},"id" : "129","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/129"});

products.insert({"region" : "NA", "category" : "Kids & Babies", "name" : "Toddler Hooded Sweatshirt","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.com/api/v1/countries/124"},"price" : {"vatExcluded":16.20,"vatIncluded":16.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/404/views/2/appearances/194"},"id" : "404","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/404"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Long Sleeve T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":16.40,"vatIncluded":16.40,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/23/views/1/appearances/4"},"id" : "23","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/23"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Womens Tri-Blend Long Sleeve T-Shirt","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":15.50,"vatIncluded":15.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/883/views/1/appearances/540"},"id" : "883","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/883"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Muscle T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":14.20,"vatIncluded":14.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/98/views/1/appearances/4"},"id" : "98","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/98"});

products.insert({"region" : "NA", "category" : "Kids & Babies", "name" : "Kids\u0027 Long Sleeve T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":9.80,"vatIncluded":9.80,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/486/views/1/appearances/5"},"id" : "486","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/486"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Unisex Tri-Blend T-Shirt by American Apparel","manufacturingCountry" : {"id" : "78","href" : "http://api.spreadshirt.com/api/v1/countries/78"},"price" : {"vatExcluded":16.90,"vatIncluded":16.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/691/views/1/appearances/458"},"id" : "691","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/691"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Bottle Cap Opener T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":13.90,"vatIncluded":13.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/800/views/1/appearances/2"},"id" : "800","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/800"});

products.insert({"region" : "NA", "category" : "Kids & Babies", "name" : "Kid\u0027s Zip Hoodie","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":20.90,"vatIncluded":20.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/677/views/2/appearances/5"},"id" : "677","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/677"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Drawstring Bag","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":8.70,"vatIncluded":8.70,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/775/views/1/appearances/349"},"id" : "775","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/775"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s V-Neck T-Shirt by Canvas","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":16.40,"vatIncluded":16.40,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/686/views/1/appearances/17"},"id" : "686","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/686"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men’s Contrast Tank Top","manufacturingCountry" : {"id" : "79","href" : "http://api.spreadshirt.com/api/v1/countries/79"},"price" : {"vatExcluded":15.90,"vatIncluded":15.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/865/views/1/appearances/400"},"id" : "865","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/865"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Maternity T-Shirt","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.com/api/v1/countries/102"},"price" : {"vatExcluded":16.40,"vatIncluded":16.40,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/377/views/1/appearances/2"},"id" : "377","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/377"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men’s Baseball T-Shirt","manufacturingCountry" : {"id" : "78","href" : "http://api.spreadshirt.com/api/v1/countries/78"},"price" : {"vatExcluded":19.70,"vatIncluded":19.70,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/951/views/1/appearances/70"},"id" : "951","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/951"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Zip Hoodie","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":27.40,"vatIncluded":27.40,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/198/views/2/appearances/4"},"id" : "198","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/198"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "iPhone 4/4S Rubber Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/827/views/1/appearances/70"},"id" : "827","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/827"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Zip Hoodie","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.com/api/v1/countries/124"},"price" : {"vatExcluded":27.40,"vatIncluded":27.40,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/197/views/2/appearances/164"},"id" : "197","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/197"});

products.insert({"region" : "NA", "category" : "Kids & Babies", "name" : "Kids\u0027 T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":6.50,"vatIncluded":6.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/48/views/1/appearances/2"},"id" : "48","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/48"});

products.insert({"region" : "NA", "category" : "Kids & Babies", "name" : "Baby Short Sleeve One Piece","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.com/api/v1/countries/102"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/401/views/1/appearances/114"},"id" : "401","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/401"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Organic T-Shirt","manufacturingCountry" : {"id" : "79","href" : "http://api.spreadshirt.com/api/v1/countries/79"},"price" : {"vatExcluded":16.40,"vatIncluded":16.40,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/460/views/1/appearances/2"},"id" : "460","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/460"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Organic T-Shirt","manufacturingCountry" : {"id" : "79","href" : "http://api.spreadshirt.com/api/v1/countries/79"},"price" : {"vatExcluded":15.30,"vatIncluded":15.30,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/461/views/1/appearances/2"},"id" : "461","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/461"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "iPad 2/3 Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":13.90,"vatIncluded":13.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/783/views/1/appearances/70"},"id" : "783","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/783"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Bamboo Performance Tank by ALO","manufacturingCountry" : {"id" : "134","href" : "http://api.spreadshirt.com/api/v1/countries/134"},"price" : {"vatExcluded":23.70,"vatIncluded":23.70,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/746/views/1/appearances/486"},"id" : "746","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/746"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Unisex Tie Dye T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":12.00,"vatIncluded":12.00,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/491/views/1/appearances/253"},"id" : "491","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/491"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Polo Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":13.10,"vatIncluded":13.10,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/110/views/1/appearances/1"},"id" : "110","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/110"});

products.insert({"region" : "NA", "category" : "Kids & Babies", "name" : "Kid’s Organic T-Shirt by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":11.90,"vatIncluded":11.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/928/views/1/appearances/1"},"id" : "928","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/928"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Tall T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":16.40,"vatIncluded":16.40,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/650/views/1/appearances/1"},"id" : "650","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/650"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s 3XL/4XL Hooded Sweatshirt","manufacturingCountry" : {"id" : "84","href" : "http://api.spreadshirt.com/api/v1/countries/84"},"price" : {"vatExcluded":30.70,"vatIncluded":30.70,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/679/views/2/appearances/399"},"id" : "679","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/679"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "Samsung Galaxy S4 Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/858/views/1/appearances/70"},"id" : "858","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/858"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "iPhone 4/4S Hard Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/776/views/1/appearances/70"},"id" : "776","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/776"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "Samsung Galaxy S2 Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/784/views/1/appearances/70"},"id" : "784","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/784"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "Samsung Galaxy S3 Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/785/views/1/appearances/70"},"id" : "785","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/785"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Knit Beanie","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":8.90,"vatIncluded":8.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/890/views/1/appearances/469"},"id" : "890","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/890"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Bandana","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":6.50,"vatIncluded":6.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/610/views/1/appearances/366"},"id" : "610","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/610"});

products.insert({"region" : "NA", "category" : "Kids & Babies", "name" : "Kids\u0027 Ringer T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/487/views/1/appearances/70"},"id" : "487","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/487"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Eco-Friendly Cotton Tote","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.com/api/v1/countries/102"},"price" : {"vatExcluded":9.80,"vatIncluded":9.80,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/378/views/1/appearances/2"},"id" : "378","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/378"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "Nexus 7 Tablet Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":13.90,"vatIncluded":13.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/852/views/1/appearances/70"},"id" : "852","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/852"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Hip Hugger Underwear","manufacturingCountry" : {"id" : "123","href" : "http://api.spreadshirt.com/api/v1/countries/123"},"price" : {"vatExcluded":8.70,"vatIncluded":8.70,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/160/views/1/appearances/18"},"id" : "160","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/160"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Dog Bandana","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.60,"vatIncluded":7.60,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/611/views/1/appearances/367"},"id" : "611","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/611"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Heather Jersey T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/402/views/1/appearances/187"},"id" : "402","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/402"});

products.insert({"region" : "NA", "category" : "Kids & Babies", "name" : "Organic Baby Bib","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.com/api/v1/countries/102"},"price" : {"vatExcluded":6.90,"vatIncluded":6.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/634/views/1/appearances/391"},"id" : "634","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/634"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Sports Bra by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":22.90,"vatIncluded":22.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/967/views/1/appearances/129"},"id" : "967","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/967"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Fitness Pants by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":28.50,"vatIncluded":28.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/970/views/3/appearances/129"},"id" : "970","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/970"});

products.insert({"region" : "NA", "category" : "Kids & Babies", "name" : "Baby Lap Shoulder T-Shirt","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.com/api/v1/countries/102"},"price" : {"vatExcluded":7.60,"vatIncluded":7.60,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/375/views/1/appearances/444"},"id" : "375","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/375"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Backpack","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":19.90,"vatIncluded":19.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/873/views/1/appearances/109"},"id" : "873","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/873"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Brief Case Messenger Bag","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":20.80,"vatIncluded":20.80,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/723/views/1/appearances/2"},"id" : "723","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/723"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Unisex Track Jacket by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":29.20,"vatIncluded":29.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/103/views/2/appearances/2"},"id" : "103","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/103"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Large Buttons","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":3.00,"vatIncluded":3.00,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/125/views/1/appearances/1"},"id" : "125","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/125"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Small Buttons","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":2.00,"vatIncluded":2.00,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/127/views/1/appearances/1"},"id" : "127","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/127"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Medium Buttons","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":2.50,"vatIncluded":2.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/126/views/1/appearances/1"},"id" : "126","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/126"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Water Bottle","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/757/views/3/appearances/37"},"id" : "757","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/757"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Boxer Shorts","manufacturingCountry" : {"id" : "78","href" : "http://api.spreadshirt.com/api/v1/countries/78"},"price" : {"vatExcluded":15.30,"vatIncluded":15.30,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/715/views/1/appearances/348"},"id" : "715","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/715"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Scoop Neck T-Shirt","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":14.20,"vatIncluded":14.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/561/views/1/appearances/393"},"id" : "561","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/561"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Ringer T-Shirt by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":14.90,"vatIncluded":14.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/121/views/1/appearances/70"},"id" : "121","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/121"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Duffel Bag","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":17.50,"vatIncluded":17.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/636/views/1/appearances/327"},"id" : "636","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/636"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Knit Cap","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":6.50,"vatIncluded":6.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/51/views/1/appearances/5"},"id" : "51","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/51"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Knit Cap with Cuff Print","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":6.50,"vatIncluded":6.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/945/views/1/appearances/2"},"id" : "945","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/945"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women’s Deep V-Neck Marble T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":17.50,"vatIncluded":17.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/968/views/1/appearances/568"},"id" : "968","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/968"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s String Thong","manufacturingCountry" : {"id" : "71","href" : "http://api.spreadshirt.com/api/v1/countries/71"},"price" : {"vatExcluded":7.60,"vatIncluded":7.60,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/115/views/1/appearances/5"},"id" : "115","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/115"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men’s Raglan Crewneck Sweatshirt","manufacturingCountry" : {"id" : "68","href" : "http://api.spreadshirt.com/api/v1/countries/68"},"price" : {"vatExcluded":30.90,"vatIncluded":30.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/908/views/1/appearances/550"},"id" : "908","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/908"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "Blackberry Z10 Hard Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/859/views/1/appearances/70"},"id" : "859","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/859"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Sweatpants","manufacturingCountry" : {"id" : "71","href" : "http://api.spreadshirt.com/api/v1/countries/71"},"price" : {"vatExcluded":23.00,"vatIncluded":23.00,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/555/views/1/appearances/164"},"id" : "555","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/555"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "iPod Touch Hard Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/863/views/1/appearances/70"},"id" : "863","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/863"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "HTC One X Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/862/views/1/appearances/70"},"id" : "862","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/862"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "iPad Mini Hard Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":13.90,"vatIncluded":13.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/861/views/1/appearances/70"},"id" : "861","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/861"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women’s Varsity Hooded Sweatshirt Jacket","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.com/api/v1/countries/124"},"price" : {"vatExcluded":37.50,"vatIncluded":37.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/836/views/1/appearances/341"},"id" : "836","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/836"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men’s Varsity Sweatshirt Jacket","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.com/api/v1/countries/124"},"price" : {"vatExcluded":37.50,"vatIncluded":37.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/835/views/1/appearances/341"},"id" : "835","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/835"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Replica Football Jersey by Augusta","manufacturingCountry" : {"id" : "78","href" : "http://api.spreadshirt.com/api/v1/countries/78"},"price" : {"vatExcluded":22.90,"vatIncluded":22.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/874/views/1/appearances/2"},"id" : "874","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/874"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "Samsung Galaxy Note 2 Hard Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":13.90,"vatIncluded":13.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/864/views/1/appearances/70"},"id" : "864","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/864"});

products.insert({"region" : "NA", "category" : "Cases", "name" : "Samsung Note 8.0 Hard Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":13.90,"vatIncluded":13.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/860/views/1/appearances/70"},"id" : "860","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/860"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Capri Yoga Pants","manufacturingCountry" : {"id" : "134","href" : "http://api.spreadshirt.com/api/v1/countries/134"},"price" : {"vatExcluded":25.90,"vatIncluded":25.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/749/views/1/appearances/2"},"id" : "749","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/749"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Knit Pom Cap","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":9.90,"vatIncluded":9.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/889/views/1/appearances/376"},"id" : "889","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/889"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Bath Towel","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":19.99,"vatIncluded":19.99,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/853/views/1/appearances/1"},"id" : "853","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/853"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Fitness Shorts","manufacturingCountry" : {"id" : "134","href" : "http://api.spreadshirt.com/api/v1/countries/134"},"price" : {"vatExcluded":13.50,"vatIncluded":13.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/639/views/1/appearances/2"},"id" : "639","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/639"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Sweatpants","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":25.20,"vatIncluded":25.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/671/views/1/appearances/2"},"id" : "671","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/671"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Country Scarf","manufacturingCountry" : {"id" : "148","href" : "http://api.spreadshirt.com/api/v1/countries/148"},"price" : {"vatExcluded":12.90,"vatIncluded":12.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/944/views/1/appearances/570"},"id" : "944","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/944"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men’s Basketball Jersey","manufacturingCountry" : {"id" : "78","href" : "http://api.spreadshirt.com/api/v1/countries/78"},"price" : {"vatExcluded":13.50,"vatIncluded":13.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/879/views/1/appearances/54"},"id" : "879","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/879"});

products.insert({"region" : "NA", "category" : "Kids & Babies", "name" : "Kid’s Basketball Jersey","manufacturingCountry" : {"id" : "78","href" : "http://api.spreadshirt.com/api/v1/countries/78"},"price" : {"vatExcluded":9.99,"vatIncluded":9.99,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/880/views/1/appearances/54"},"id" : "880","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/880"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Jersey Scarf by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":13.90,"vatIncluded":13.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/593/views/1/appearances/129"},"id" : "593","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/593"});

products.insert({"region" : "NA", "category" : "Kids & Babies", "name" : "Baby Cap by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":6.90,"vatIncluded":6.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/817/views/1/appearances/2"},"id" : "817","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/817"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Pique Polo Shirt","manufacturingCountry" : {"id" : "123","href" : "http://api.spreadshirt.com/api/v1/countries/123"},"price" : {"vatExcluded":21.50,"vatIncluded":21.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/728/views/1/appearances/2"},"id" : "728","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/728"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Baseball T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":19.70,"vatIncluded":19.70,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/102/views/1/appearances/26"},"id" : "102","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/102"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Performance T-Shirt by Champion","manufacturingCountry" : {"id" : "108","href" : "http://api.spreadshirt.com/api/v1/countries/108"},"price" : {"vatExcluded":17.90,"vatIncluded":17.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/698/views/1/appearances/2"},"id" : "698","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/698"});

products.insert({"region" : "NA", "category" : "Accessories", "name" : "Knit Earflap Cap","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":8.50,"vatIncluded":8.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/887/views/1/appearances/2"},"id" : "887","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/887"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Women\u0027s Performance T-Shirt by Champion","manufacturingCountry" : {"id" : "108","href" : "http://api.spreadshirt.com/api/v1/countries/108"},"price" : {"vatExcluded":16.50,"vatIncluded":16.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/699/views/1/appearances/2"},"id" : "699","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/699"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Zip Hoodie by Dickies","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.com/api/v1/countries/124"},"price" : {"vatExcluded":48.90,"vatIncluded":48.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/357/views/1/appearances/2"},"id" : "357","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/357"});

products.insert({"region" : "NA", "category" : "Men", "name" : "Men\u0027s Performance Shorts","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":16.90,"vatIncluded":16.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/750/views/1/appearances/2"},"id" : "750","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/750"});

products.insert({"region" : "NA", "category" : "Women", "name" : "Belly band for pregnant women","manufacturingCountry" : {"id" : "137","href" : "http://api.spreadshirt.com/api/v1/countries/137"},"price" : {"vatExcluded":6.79,"vatIncluded":6.79,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/753/views/1/appearances/1"},"id" : "753","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/753"});


// EU products


products.insert({"region" : "EU", "category" : "Men", "name" : "Men’s Premium T-Shirt","manufacturingCountry" : {"id" : "171","href" : "http://api.spreadshirt.net/api/v1/countries/171"},"price" : {"vatExcluded" : 10.75,"vatIncluded" : 12.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/812/views/1/appearances/231"},"id" : "812","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/812"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women’s Premium T-Shirt","manufacturingCountry" : {"id" : "171","href" : "http://api.spreadshirt.net/api/v1/countries/171"},"price" : {"vatExcluded" : 10.75,"vatIncluded" : 12.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/813/views/1/appearances/1"},"id" : "813","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/813"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Kids\u0027 Premium T-Shirt","manufacturingCountry" : {"id" : "171","href" : "http://api.spreadshirt.net/api/v1/countries/171"},"price" : {"vatExcluded" : 7.08,"vatIncluded" : 8.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/814/views/1/appearances/92"},"id" : "814","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/814"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Teenage Premium T-Shirt","manufacturingCountry" : {"id" : "171","href" : "http://api.spreadshirt.net/api/v1/countries/171"},"price" : {"vatExcluded" : 7.08,"vatIncluded" : 8.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/815/views/1/appearances/366"},"id" : "815","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/815"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Mug","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.net/api/v1/countries/124"},"price" : {"vatExcluded" : 6.58,"vatIncluded" : 7.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/31/views/1/appearances/1"},"id" : "31","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/31"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Cooking Apron","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.net/api/v1/countries/124"},"price" : {"vatExcluded" : 12.42,"vatIncluded" : 14.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/141/views/1/appearances/17"},"id" : "141","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/141"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men’s College Jacket","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 32.42,"vatIncluded" : 38.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/834/views/1/appearances/405"},"id" : "834","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/834"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Contrasting Mug","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 7.08,"vatIncluded" : 8.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/268/views/3/appearances/541"},"id" : "268","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/268"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Water Bottle","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 7.42,"vatIncluded" : 8.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/757/views/3/appearances/1"},"id" : "757","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/757"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "iPhone 4/4S Premium Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 15.42,"vatIncluded" : 18.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/869/views/1/appearances/1"},"id" : "869","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/869"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Drawstring Bag","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 5.17,"vatIncluded" : 6.20,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/759/views/1/appearances/92"},"id" : "759","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/759"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "Samsung Galaxy S5 Premium Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 15.42,"vatIncluded" : 18.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/947/views/1/appearances/1"},"id" : "947","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/947"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 9.08,"vatIncluded" : 10.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/6/views/1/appearances/4"},"id" : "6","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/6"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 9.08,"vatIncluded" : 10.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/631/views/1/appearances/1"},"id" : "631","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/631"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women’s College Jacket","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 32.42,"vatIncluded" : 38.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/833/views/1/appearances/209"},"id" : "833","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/833"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men’s Premium Tank Top","manufacturingCountry" : {"id" : "171","href" : "http://api.spreadshirt.net/api/v1/countries/171"},"price" : {"vatExcluded" : 9.92,"vatIncluded" : 11.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/916/views/1/appearances/2"},"id" : "916","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/916"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women’s Premium Tank Top","manufacturingCountry" : {"id" : "171","href" : "http://api.spreadshirt.net/api/v1/countries/171"},"price" : {"vatExcluded" : 9.92,"vatIncluded" : 11.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/917/views/1/appearances/506"},"id" : "917","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/917"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women’s Sweatshirt by Stanley \u0026 Stella","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.net/api/v1/countries/124"},"price" : {"vatExcluded" : 20.75,"vatIncluded" : 24.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/891/views/1/appearances/367"},"id" : "891","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/891"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Canvas Bag","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 20.75,"vatIncluded" : 24.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/847/views/1/appearances/482"},"id" : "847","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/847"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Baby Long Sleeve One Piece","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 8.75,"vatIncluded" : 10.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/816/views/1/appearances/203"},"id" : "816","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/816"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Full Colour Mug","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 7.42,"vatIncluded" : 8.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/949/views/3/appearances/2"},"id" : "949","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/949"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Flowy Tank Top by Bella","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 11.25,"vatIncluded" : 13.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/752/views/1/appearances/412"},"id" : "752","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/752"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Baby Long Sleeve T-Shirt","manufacturingCountry" : {"id" : "50","href" : "http://api.spreadshirt.net/api/v1/countries/50"},"price" : {"vatExcluded" : 8.75,"vatIncluded" : 10.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/818/views/1/appearances/194"},"id" : "818","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/818"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Football Jersey","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/881/views/1/appearances/54"},"id" : "881","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/881"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "iPhone 5/5S Premium Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 15.42,"vatIncluded" : 18.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/870/views/1/appearances/1"},"id" : "870","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/870"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Delegate Shoulder Bag by Eastpak","manufacturingCountry" : {"id" : "129","href" : "http://api.spreadshirt.net/api/v1/countries/129"},"price" : {"vatExcluded" : 37.08,"vatIncluded" : 44.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/843/views/1/appearances/251"},"id" : "843","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/843"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Baby Organic Bib","manufacturingCountry" : {"id" : "137","href" : "http://api.spreadshirt.net/api/v1/countries/137"},"price" : {"vatExcluded" : 8.50,"vatIncluded" : 8.50,"vat" : 0.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/235/views/1/appearances/306"},"id" : "235","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/235"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Bum bag","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 8.75,"vatIncluded" : 10.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/828/views/1/appearances/418"},"id" : "828","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/828"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Joggers by Urban Classic","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 20.75,"vatIncluded" : 24.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/747/views/1/appearances/2"},"id" : "747","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/747"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Hoodie","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 20.17,"vatIncluded" : 24.20,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/20/views/2/appearances/251"},"id" : "20","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/20"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Hoodie","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 20.17,"vatIncluded" : 24.20,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/444/views/2/appearances/447"},"id" : "444","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/444"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Kids’ Racerback Top","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 8.25,"vatIncluded" : 9.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/823/views/1/appearances/511"},"id" : "823","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/823"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Kids’ Baseball T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 8.75,"vatIncluded" : 10.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/824/views/1/appearances/512"},"id" : "824","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/824"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Kids\u0027 Hoodie","manufacturingCountry" : {"id" : "108","href" : "http://api.spreadshirt.net/api/v1/countries/108"},"price" : {"vatExcluded" : 17.08,"vatIncluded" : 20.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/654/views/2/appearances/419"},"id" : "654","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/654"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "Samsung Galaxy S3 Premium Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 15.42,"vatIncluded" : 18.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/871/views/1/appearances/1"},"id" : "871","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/871"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "Kindle Touch Cover","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 10.75,"vatIncluded" : 12.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/786/views/1/appearances/70"},"id" : "786","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/786"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Sports Shorts","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 13.42,"vatIncluded" : 16.10,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/743/views/1/appearances/461"},"id" : "743","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/743"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "iPhone 5/5S Rubber Case","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 8.75,"vatIncluded" : 10.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/822/views/1/appearances/70"},"id" : "822","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/822"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Joggers by Urban Classics","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 20.75,"vatIncluded" : 24.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/748/views/1/appearances/17"},"id" : "748","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/748"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Kids\u0027 Long Sleeve T-Shirt","manufacturingCountry" : {"id" : "14","href" : "http://api.spreadshirt.net/api/v1/countries/14"},"price" : {"vatExcluded" : 10.42,"vatIncluded" : 12.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/495/views/1/appearances/1"},"id" : "495","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/495"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Football Fan Scarf","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 5.42,"vatIncluded" : 6.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/935/views/1/appearances/539"},"id" : "935","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/935"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Premium Longsleeve Shirt","manufacturingCountry" : {"id" : "171","href" : "http://api.spreadshirt.net/api/v1/countries/171"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/875/views/1/appearances/231"},"id" : "875","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/875"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "Samsung Galaxy S4 Premium Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 15.42,"vatIncluded" : 18.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/872/views/1/appearances/1"},"id" : "872","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/872"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Premium Longsleeve Shirt","manufacturingCountry" : {"id" : "171","href" : "http://api.spreadshirt.net/api/v1/countries/171"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/876/views/1/appearances/366"},"id" : "876","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/876"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Kids’ Breathable T-Shirt","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 9.58,"vatIncluded" : 11.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/980/views/1/appearances/1"},"id" : "980","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/980"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men‘s V-Neck T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.net/api/v1/countries/86"},"price" : {"vatExcluded" : 10.92,"vatIncluded" : 13.10,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/686/views/1/appearances/17"},"id" : "686","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/686"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "iPhone 4/4S Hard Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 8.75,"vatIncluded" : 10.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/776/views/1/appearances/70"},"id" : "776","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/776"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Kids\u0027 Premium Longsleeve Shirt","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 11.58,"vatIncluded" : 13.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/877/views/1/appearances/348"},"id" : "877","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/877"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Kids\u0027 T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 5.42,"vatIncluded" : 6.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/724/views/1/appearances/1"},"id" : "724","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/724"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Shoulder Bag","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 18.17,"vatIncluded" : 21.80,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/730/views/1/appearances/237"},"id" : "730","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/730"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "iPhone 5/5S Hard Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 8.75,"vatIncluded" : 10.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/782/views/1/appearances/70"},"id" : "782","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/782"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Bathing Towel","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/849/views/1/appearances/1"},"id" : "849","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/849"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Teenagers\u0027 Premium Longsleeve Shirt","manufacturingCountry" : {"id" : "171","href" : "http://api.spreadshirt.net/api/v1/countries/171"},"price" : {"vatExcluded" : 11.25,"vatIncluded" : 13.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/878/views/1/appearances/348"},"id" : "878","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/878"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Windbreaker","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 14.42,"vatIncluded" : 17.30,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/758/views/1/appearances/1"},"id" : "758","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/758"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Provider Backpack by Eastpak","manufacturingCountry" : {"id" : "129","href" : "http://api.spreadshirt.net/api/v1/countries/129"},"price" : {"vatExcluded" : 47.92,"vatIncluded" : 57.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/844/views/1/appearances/527"},"id" : "844","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/844"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Leggings","manufacturingCountry" : {"id" : "79","href" : "http://api.spreadshirt.net/api/v1/countries/79"},"price" : {"vatExcluded" : 12.08,"vatIncluded" : 14.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/925/views/3/appearances/2"},"id" : "925","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/925"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women’s T-shirt with rolled up sleeves","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 10.75,"vatIncluded" : 12.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/943/views/1/appearances/557"},"id" : "943","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/943"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Shoulder Bag made from recycled material","manufacturingCountry" : {"id" : "137","href" : "http://api.spreadshirt.net/api/v1/countries/137"},"price" : {"vatExcluded" : 7.92,"vatIncluded" : 9.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/942/views/1/appearances/495"},"id" : "942","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/942"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Teenage T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 6.50,"vatIncluded" : 6.50,"vat" : 0.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/725/views/1/appearances/1"},"id" : "725","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/725"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "iPad 2/3 Cover","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/783/views/1/appearances/70"},"id" : "783","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/783"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Padded Pak’R Backpack by Eastpak","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 35.75,"vatIncluded" : 42.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/845/views/1/appearances/527"},"id" : "845","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/845"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s T-Shirt by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.net/api/v1/countries/86"},"price" : {"vatExcluded" : 16.42,"vatIncluded" : 19.70,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/175/views/1/appearances/464"},"id" : "175","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/175"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Flip-Flops","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 11.25,"vatIncluded" : 13.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/846/views/1/appearances/70"},"id" : "846","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/846"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Snapback Cap","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 8.25,"vatIncluded" : 9.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/905/views/1/appearances/461"},"id" : "905","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/905"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s T-Shirt by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.net/api/v1/countries/86"},"price" : {"vatExcluded" : 16.42,"vatIncluded" : 19.70,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/288/views/1/appearances/99"},"id" : "288","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/288"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Tote Bag","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 5.42,"vatIncluded" : 6.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/56/views/1/appearances/494"},"id" : "56","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/56"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s T-Shirt Dress","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 11.25,"vatIncluded" : 13.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/760/views/1/appearances/2"},"id" : "760","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/760"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "Samsung Galaxy S2 Cover","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 8.75,"vatIncluded" : 10.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/784/views/1/appearances/70"},"id" : "784","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/784"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Sports Shorts","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 13.42,"vatIncluded" : 16.10,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/745/views/1/appearances/461"},"id" : "745","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/745"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Beer Mug","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 9.17,"vatIncluded" : 11.00,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/717/views/1/appearances/1"},"id" : "717","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/717"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Ringer Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 14.33,"vatIncluded" : 17.20,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/646/views/1/appearances/472"},"id" : "646","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/646"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Baby T-Shirt","manufacturingCountry" : {"id" : "1","href" : "http://api.spreadshirt.net/api/v1/countries/1"},"price" : {"vatExcluded" : 7.08,"vatIncluded" : 8.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/664/views/1/appearances/441"},"id" : "664","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/664"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Travel Mug","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 10.92,"vatIncluded" : 13.10,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/773/views/3/appearances/1"},"id" : "773","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/773"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men’s Football shorts","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 10.42,"vatIncluded" : 12.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/882/views/1/appearances/54"},"id" : "882","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/882"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Country T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 8.17,"vatIncluded" : 9.80,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/70/views/1/appearances/43"},"id" : "70","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/70"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "iPhone 4/4S Rubber Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 8.75,"vatIncluded" : 10.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/827/views/1/appearances/70"},"id" : "827","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/827"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Pillowcase, 80 x 40 cm","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 10.42,"vatIncluded" : 12.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/911/views/1/appearances/1"},"id" : "911","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/911"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Pillowcase 40 x 40 cm","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 7.08,"vatIncluded" : 8.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/912/views/1/appearances/1"},"id" : "912","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/912"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Pillow Case 80 x 80 cm","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 13.42,"vatIncluded" : 16.10,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/680/views/1/appearances/1"},"id" : "680","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/680"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Duffel Bag","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 14.33,"vatIncluded" : 17.20,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/638/views/1/appearances/367"},"id" : "638","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/638"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Polo","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 15.33,"vatIncluded" : 18.40,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/379/views/1/appearances/511"},"id" : "379","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/379"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men’s Sweater by Dickies","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 27.42,"vatIncluded" : 32.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/906/views/1/appearances/2"},"id" : "906","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/906"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Baby Organic Short Sleeve T-shirt","manufacturingCountry" : {"id" : "137","href" : "http://api.spreadshirt.net/api/v1/countries/137"},"price" : {"vatExcluded" : 10.50,"vatIncluded" : 10.50,"vat" : 0.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/375/views/1/appearances/18"},"id" : "375","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/375"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Baby Bodysuit","manufacturingCountry" : {"id" : "50","href" : "http://api.spreadshirt.net/api/v1/countries/50"},"price" : {"vatExcluded" : 8.75,"vatIncluded" : 10.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/560/views/1/appearances/425"},"id" : "560","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/560"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "EarthPositive Tote Bag","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.net/api/v1/countries/102"},"price" : {"vatExcluded" : 7.58,"vatIncluded" : 9.10,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/563/views/1/appearances/357"},"id" : "563","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/563"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Retro T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 16.25,"vatIncluded" : 19.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/144/views/1/appearances/48"},"id" : "144","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/144"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Umbrella (small)","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 6.67,"vatIncluded" : 8.00,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/55/views/1/appearances/2"},"id" : "55","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/55"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Ringer T-Shirt","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 11.50,"vatIncluded" : 13.80,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/718/views/1/appearances/474"},"id" : "718","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/718"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Flexfit Baseball Cap","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 17.25,"vatIncluded" : 20.70,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/428/views/1/appearances/1"},"id" : "428","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/428"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Baby Cap","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.net/api/v1/countries/86"},"price" : {"vatExcluded" : 8.25,"vatIncluded" : 9.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/817/views/1/appearances/88"},"id" : "817","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/817"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women‘s V-Neck T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 10.42,"vatIncluded" : 12.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/857/views/1/appearances/492"},"id" : "857","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/857"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Zip Hoodie by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.net/api/v1/countries/86"},"price" : {"vatExcluded" : 32.00,"vatIncluded" : 38.40,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/669/views/2/appearances/449"},"id" : "669","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/669"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men’s Baseball T-Shirt","manufacturingCountry" : {"id" : "14","href" : "http://api.spreadshirt.net/api/v1/countries/14"},"price" : {"vatExcluded" : 11.50,"vatIncluded" : 13.80,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/114/views/1/appearances/26"},"id" : "114","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/114"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Baby Organic Long Sleeve Shirt","manufacturingCountry" : {"id" : "137","href" : "http://api.spreadshirt.net/api/v1/countries/137"},"price" : {"vatExcluded" : 10.30,"vatIncluded" : 10.30,"vat" : 0.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/202/views/1/appearances/86"},"id" : "202","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/202"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Reflective Vest","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 8.25,"vatIncluded" : 9.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/719/views/1/appearances/413"},"id" : "719","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/719"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Long Sleeve Shirt","manufacturingCountry" : {"id" : "137","href" : "http://api.spreadshirt.net/api/v1/countries/137"},"price" : {"vatExcluded" : 12.42,"vatIncluded" : 14.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/209/views/1/appearances/1"},"id" : "209","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/209"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Classic Polo Shirt","manufacturingCountry" : {"id" : "14","href" : "http://api.spreadshirt.net/api/v1/countries/14"},"price" : {"vatExcluded" : 15.33,"vatIncluded" : 18.40,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/25/views/1/appearances/63"},"id" : "25","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/25"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Work Vest","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 28.42,"vatIncluded" : 34.10,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/721/views/1/appearances/2"},"id" : "721","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/721"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Spaghetti Top","manufacturingCountry" : {"id" : "137","href" : "http://api.spreadshirt.net/api/v1/countries/137"},"price" : {"vatExcluded" : 10.50,"vatIncluded" : 12.60,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/123/views/1/appearances/1"},"id" : "123","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/123"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "Samsung Galaxy S3 Cover","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 8.75,"vatIncluded" : 10.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/785/views/1/appearances/70"},"id" : "785","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/785"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "Samsung Galaxy S4 Cover","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 6.58,"vatIncluded" : 7.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/858/views/1/appearances/70"},"id" : "858","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/858"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Retro Bag","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 16.25,"vatIncluded" : 19.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/484/views/1/appearances/472"},"id" : "484","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/484"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Organic T-shirt","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.net/api/v1/countries/102"},"price" : {"vatExcluded" : 16.25,"vatIncluded" : 19.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/461/views/1/appearances/393"},"id" : "461","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/461"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Slim Fit T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 9.50,"vatIncluded" : 11.40,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/963/views/1/appearances/2"},"id" : "963","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/963"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Boat Neck Long Sleeve Top","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.net/api/v1/countries/86"},"price" : {"vatExcluded" : 25.92,"vatIncluded" : 31.10,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/681/views/1/appearances/2"},"id" : "681","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/681"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Shopping Bag","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/848/views/1/appearances/529"},"id" : "848","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/848"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Deep V-neck Shirt","manufacturingCountry" : {"id" : "137","href" : "http://api.spreadshirt.net/api/v1/countries/137"},"price" : {"vatExcluded" : 12.75,"vatIncluded" : 15.30,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/562/views/1/appearances/206"},"id" : "562","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/562"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Polo Shirt","manufacturingCountry" : {"id" : "137","href" : "http://api.spreadshirt.net/api/v1/countries/137"},"price" : {"vatExcluded" : 14.33,"vatIncluded" : 17.20,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/281/views/1/appearances/306"},"id" : "281","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/281"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Hooded Jacket","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 23.00,"vatIncluded" : 27.60,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/93/views/2/appearances/4"},"id" : "93","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/93"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Kids\u0027 Organic T-shirt","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.net/api/v1/countries/102"},"price" : {"vatExcluded" : 8.75,"vatIncluded" : 10.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/457/views/1/appearances/146"},"id" : "457","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/457"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Scoop Neck T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.net/api/v1/countries/86"},"price" : {"vatExcluded" : 13.42,"vatIncluded" : 16.10,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/561/views/1/appearances/312"},"id" : "561","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/561"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "Nexus 7 Cover","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/852/views/1/appearances/70"},"id" : "852","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/852"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Kids Safety Vest","manufacturingCountry" : {"id" : "264","href" : "http://api.spreadshirt.net/api/v1/countries/264"},"price" : {"vatExcluded" : 4.92,"vatIncluded" : 5.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/866/views/1/appearances/413"},"id" : "866","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/866"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Boxer Briefs","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 8.58,"vatIncluded" : 10.30,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/146/views/1/appearances/2"},"id" : "146","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/146"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Unisex Tri-Blend T-Shirt by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.net/api/v1/countries/86"},"price" : {"vatExcluded" : 18.25,"vatIncluded" : 21.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/691/views/1/appearances/458"},"id" : "691","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/691"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Golf Umbrella","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 17.25,"vatIncluded" : 20.70,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/712/views/1/appearances/306"},"id" : "712","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/712"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Organic Hoodie","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.net/api/v1/countries/102"},"price" : {"vatExcluded" : 28.42,"vatIncluded" : 34.10,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/685/views/2/appearances/451"},"id" : "685","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/685"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Hip Hugger Underwear","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 9.50,"vatIncluded" : 11.40,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/160/views/1/appearances/1"},"id" : "160","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/160"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Bistro Apron","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 14.00,"vatIncluded" : 16.80,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/713/views/1/appearances/1"},"id" : "713","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/713"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "HTC One X Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 8.75,"vatIncluded" : 10.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/862/views/1/appearances/70"},"id" : "862","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/862"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "iPod Touch Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 8.75,"vatIncluded" : 10.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/863/views/1/appearances/70"},"id" : "863","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/863"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Organic Hoodie","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.net/api/v1/countries/102"},"price" : {"vatExcluded" : 28.42,"vatIncluded" : 34.10,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/684/views/2/appearances/2"},"id" : "684","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/684"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Maternity Top","manufacturingCountry" : {"id" : "137","href" : "http://api.spreadshirt.net/api/v1/countries/137"},"price" : {"vatExcluded" : 16.25,"vatIncluded" : 19.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/377/views/1/appearances/1"},"id" : "377","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/377"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Belly band for pregnant women","manufacturingCountry" : {"id" : "137","href" : "http://api.spreadshirt.net/api/v1/countries/137"},"price" : {"vatExcluded" : 9.58,"vatIncluded" : 11.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/753/views/1/appearances/1"},"id" : "753","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/753"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Hooded Jacket","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 23.00,"vatIncluded" : 27.60,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/445/views/2/appearances/5"},"id" : "445","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/445"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Long Sleeve","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.net/api/v1/countries/102"},"price" : {"vatExcluded" : 11.17,"vatIncluded" : 13.40,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/23/views/1/appearances/1"},"id" : "23","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/23"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Bandana","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 5.67,"vatIncluded" : 6.80,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/610/views/1/appearances/1"},"id" : "610","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/610"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Organic T-shirt","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.net/api/v1/countries/102"},"price" : {"vatExcluded" : 16.25,"vatIncluded" : 19.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/635/views/1/appearances/398"},"id" : "635","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/635"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Winter Hat","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 8.58,"vatIncluded" : 10.30,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/51/views/1/appearances/2"},"id" : "51","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/51"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Teddy Bear","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 11.08,"vatIncluded" : 13.30,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/623/views/1/appearances/370"},"id" : "623","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/623"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "Samsung Galaxy Note 2 Cover","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/864/views/1/appearances/70"},"id" : "864","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/864"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Cuddly Bunny with T-Shirt","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 10.75,"vatIncluded" : 12.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/929/views/1/appearances/364"},"id" : "929","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/929"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Track Jacket","manufacturingCountry" : {"id" : "137","href" : "http://api.spreadshirt.net/api/v1/countries/137"},"price" : {"vatExcluded" : 30.75,"vatIncluded" : 36.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/644/views/2/appearances/54"},"id" : "644","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/644"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men’s Breathable T-Shirt","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 11.58,"vatIncluded" : 13.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/977/views/1/appearances/2"},"id" : "977","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/977"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women’s Breathable T-Shirt","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 11.58,"vatIncluded" : 13.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/978/views/1/appearances/412"},"id" : "978","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/978"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men’s Breathable Tank Top","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 11.58,"vatIncluded" : 13.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/981/views/1/appearances/258"},"id" : "981","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/981"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women’s Breathable Tank Top","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 11.58,"vatIncluded" : 13.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/979/views/1/appearances/412"},"id" : "979","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/979"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men’s Long Sleeve Baseball T-Shirt","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 15.33,"vatIncluded" : 18.40,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/36/views/1/appearances/26"},"id" : "36","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/36"});

products.insert({"region" : "EU", "category" : "Cases", "name" : "iPad Mini Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/861/views/1/appearances/70"},"id" : "861","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/861"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Backpack","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 16.25,"vatIncluded" : 19.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/703/views/1/appearances/367"},"id" : "703","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/703"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Kids\u0027 Zip Hoodie","manufacturingCountry" : {"id" : "108","href" : "http://api.spreadshirt.net/api/v1/countries/108"},"price" : {"vatExcluded" : 17.42,"vatIncluded" : 20.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/678/views/2/appearances/2"},"id" : "678","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/678"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Tank Top","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 8.92,"vatIncluded" : 10.70,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/172/views/1/appearances/28"},"id" : "172","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/172"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Sweatshirt","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 22.08,"vatIncluded" : 26.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/5/views/1/appearances/17"},"id" : "5","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/5"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Baseball Cap","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 8.58,"vatIncluded" : 10.30,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/15/views/1/appearances/10"},"id" : "15","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/15"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Blanket","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 21.67,"vatIncluded" : 26.00,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/609/views/1/appearances/5"},"id" : "609","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/609"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Dog Bandana","manufacturingCountry" : {"id" : "0","href" : "http://api.spreadshirt.net/api/v1/countries/0"},"price" : {"vatExcluded" : 5.67,"vatIncluded" : 6.80,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/611/views/1/appearances/2"},"id" : "611","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/611"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s String Thong","manufacturingCountry" : {"id" : "123","href" : "http://api.spreadshirt.net/api/v1/countries/123"},"price" : {"vatExcluded" : 8.58,"vatIncluded" : 10.30,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/115/views/1/appearances/18"},"id" : "115","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/115"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Lanyard","manufacturingCountry" : {"id" : "148","href" : "http://api.spreadshirt.net/api/v1/countries/148"},"price" : {"vatExcluded" : 4.75,"vatIncluded" : 5.70,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/43/views/1/appearances/17"},"id" : "43","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/43"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Kids\u0027 Backpack","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 11.08,"vatIncluded" : 13.30,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/704/views/1/appearances/142"},"id" : "704","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/704"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Scarf","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 7.08,"vatIncluded" : 8.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/896/views/3/appearances/2"},"id" : "896","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/896"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Buttons large 56 mm","manufacturingCountry" : {"id" : "148","href" : "http://api.spreadshirt.net/api/v1/countries/148"},"price" : {"vatExcluded" : 3.08,"vatIncluded" : 3.70,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/125/views/1/appearances/1"},"id" : "125","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/125"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Buttons medium 32 mm","manufacturingCountry" : {"id" : "148","href" : "http://api.spreadshirt.net/api/v1/countries/148"},"price" : {"vatExcluded" : 2.67,"vatIncluded" : 3.20,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/126/views/1/appearances/1"},"id" : "126","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/126"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "Buttons small 25 mm","manufacturingCountry" : {"id" : "148","href" : "http://api.spreadshirt.net/api/v1/countries/148"},"price" : {"vatExcluded" : 1.75,"vatIncluded" : 2.10,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/127/views/1/appearances/1"},"id" : "127","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/127"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Standard T-shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 6.00,"vatIncluded" : 7.20,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/3/views/1/appearances/1"},"id" : "3","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/3"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Slim Fit T-Shirt","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.net/api/v1/countries/102"},"price" : {"vatExcluded" : 9.50,"vatIncluded" : 11.40,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/84/views/1/appearances/17"},"id" : "84","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/84"});

products.insert({"region" : "EU", "category" : "Accessories", "name" : "American Apparel Light Scarf","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.net/api/v1/countries/86"},"price" : {"vatExcluded" : 10.42,"vatIncluded" : 12.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/593/views/1/appearances/2"},"id" : "593","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/593"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Breathable T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 9.92,"vatIncluded" : 11.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/695/views/1/appearances/338"},"id" : "695","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/695"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Breathable T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 11.25,"vatIncluded" : 13.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/696/views/1/appearances/1"},"id" : "696","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/696"});

products.insert({"region" : "EU", "category" : "Kids & Babies", "name" : "Kids\u0027 Breathable T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 7.42,"vatIncluded" : 8.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/697/views/1/appearances/389"},"id" : "697","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/697"});

products.insert({"region" : "EU", "category" : "Men", "name" : "Men\u0027s Sports Tank Top","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 11.25,"vatIncluded" : 13.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/742/views/1/appearances/1"},"id" : "742","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/742"});

products.insert({"region" : "EU", "category" : "Women", "name" : "Women\u0027s Sports Top","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 11.25,"vatIncluded" : 13.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.net/image-server/v1/productTypes/744/views/1/appearances/461"},"id" : "744","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/744"});
     

// Global Products

products.insert({"region" : "Global", "category" : "Men", "name" : "Men\u0027s Standard T-Shirt","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.net/api/v1/countries/102"},"price" : {"vatExcluded" : 9.50,"vatIncluded" : 11.40,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "img/roundneck_men.png"},"id" : "84","href" : "img/roundneck_men.png"});
products.insert({"region" : "Global", "category" : "Men", "name" : "Men\u0027s Premium T-Shirt","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.net/api/v1/countries/102"},"price" : {"vatExcluded" : 9.50,"vatIncluded" : 11.40,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "img/roundneck_men.png"},"id" : "84","href" : "img/roundneck_men.png"});
products.insert({"region" : "Global", "category" : "Men", "name" : "Men\u0027s Standard V-Neck T-Shirt","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.net/api/v1/countries/102"},"price" : {"vatExcluded" : 9.50,"vatIncluded" : 11.40,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "img/vneck_men.png"},"id" : "84","href" : "img/vneck_men.png"});
products.insert({"region" : "Global", "category" : "Men", "name" : "Men\u0027s Premium V-Neck T-Shirt","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.net/api/v1/countries/102"},"price" : {"vatExcluded" : 9.50,"vatIncluded" : 11.40,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "img/vneck_men.png"},"id" : "84","href" : "img/vneck_men.png"});
products.insert({"region" : "Global", "category" : "Men", "name" : "Men\u0027s Longsleeve","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.net/api/v1/countries/102"},"price" : {"vatExcluded" : 9.50,"vatIncluded" : 11.40,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "img/longsleeve_men.png"},"id" : "84","href" : "img/vneck_men.png"});

products.insert({"region" : "Global", "category" : "Women", "name" : "Women\u0027s Standard T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 11.25,"vatIncluded" : 13.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "img/roundneck_women.png"},"id" : "696","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/696"});
products.insert({"region" : "Global", "category" : "Women", "name" : "Women\u0027s Premium T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 11.25,"vatIncluded" : 13.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "img/roundneck_women.png"},"id" : "696","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/696"});
products.insert({"region" : "Global", "category" : "Women", "name" : "Women\u0027s Standard V-Neck T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 11.25,"vatIncluded" : 13.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "img/vneck_women.png"},"id" : "696","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/696"});
products.insert({"region" : "Global", "category" : "Women", "name" : "Women\u0027s Premium V-Neck T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 11.25,"vatIncluded" : 13.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "img/vneck_women.png"},"id" : "696","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/696"});
products.insert({"region" : "Global", "category" : "Men", "name" : "Women\u0027s Longsleeve","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.net/api/v1/countries/102"},"price" : {"vatExcluded" : 9.50,"vatIncluded" : 11.40,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "img/longsleeve_women.png"},"id" : "84","href" : "img/vneck_men.png"});

products.insert({"region" : "Global", "category" : "Kids & Babies", "name" : "Kids\u0027 Standard T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.net/api/v1/countries/94"},"price" : {"vatExcluded" : 7.42,"vatIncluded" : 8.90,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "img/roundneck_kids.png"},"id" : "697","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/697"});

products.insert({"region" : "Global", "category" : "Accessories", "name" : "Baseball Cap","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.net/api/v1/countries/86"},"price" : {"vatExcluded" : 10.42,"vatIncluded" : 12.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "img/baseball_hat.png"},"id" : "593","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/593"});
products.insert({"region" : "Global", "category" : "Accessories", "name" : "Tote Bag","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.net/api/v1/countries/86"},"price" : {"vatExcluded" : 10.42,"vatIncluded" : 12.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "img/tote.png"},"id" : "593","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/593"});

products.insert({"region" : "Global", "category" : "Cases", "name" : "iPad Mini Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/783/views/1/appearances/70"},"id" : "861","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/861"});
products.insert({"region" : "Global", "category" : "Cases", "name" : "iPad Air Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/783/views/1/appearances/70"},"id" : "861","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/861"});
products.insert({"region" : "Global", "category" : "Cases", "name" : "iPad 2/3/4 Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/783/views/1/appearances/70"},"id" : "861","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/861"});
products.insert({"region" : "Global", "category" : "Cases", "name" : "iPhone 4/4S Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/869/views/1/appearances/1"},"id" : "861","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/861"});
products.insert({"region" : "Global", "category" : "Cases", "name" : "iPhone 5/5S Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/870/views/1/appearances/1"},"id" : "861","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/861"});
products.insert({"region" : "Global", "category" : "Cases", "name" : "Samsung Galaxy 3S Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/871/views/1/appearances/1"},"id" : "861","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/861"});
products.insert({"region" : "Global", "category" : "Cases", "name" : "Samsung Galaxy 4S Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/872/views/1/appearances/1"},"id" : "861","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/861"});
products.insert({"region" : "Global", "category" : "Cases", "name" : "Samsung Galaxy 5S Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.net/api/v1/countries/98"},"price" : {"vatExcluded" : 13.75,"vatIncluded" : 16.50,"vat" : 20.00,"currency" : {"id" : "2","href" : "http://api.spreadshirt.net/api/v1/currencies/2"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/947/views/1/appearances/1"},"id" : "861","href" : "http://api.spreadshirt.net/api/v1/shops/205909/productTypes/861"});



      }

      var shop_count = shops.find().count();
      if(shop_count < 1) {
        shops.insert({shop: "English Memes"});
        shops.insert({shop: "Hipsterama"});
      }

      var designs_count = designs.find().count();
      if(designs_count < 1) {
        designs.insert({"name":"Chocolate Ice Cream Cone", "url":"/img/designs/png-1.png"});
        designs.insert({"name":"Capoeira", "url":"/img/designs/png-2.png"});
        designs.insert({"name":"Muai Thai", "url":"/img/designs/png-3.png"});
        designs.insert({"name":"Taekwondo", "url":"/img/designs/png-4.png"});
        designs.insert({"name":"Gamers don't die, they respawn", "url":"/img/designs/png-5.png"});
        designs.insert({"name":"Pro Gamer", "url":"/img/designs/png-6.png"});
        designs.insert({"name":"Gamer Headset", "url":"/img/designs/png-7.png"});
        designs.insert({"name":"Hipster Triangle", "url":"/img/designs/png-8.png"});
        designs.insert({"name":"Bam", "url":"/img/designs/png-9.png"});
        designs.insert({"name":"Gorilla", "url":"/img/designs/png-10.png"});
        designs.insert({"name":"Pink Cupcake", "url":"/img/designs/png-11.png"});
        designs.insert({"name":"Teal Cupcake", "url":"/img/designs/png-12.png"});
        designs.insert({"name":"Hedgehog", "url":"/img/designs/png-13.png"});
        designs.insert({"name":"Blue Owl", "url":"/img/designs/png-14.png"});
        designs.insert({"name":"Keep Calm", "url":"/img/designs/png-15.png"});
        designs.insert({"name":"Cute Lion", "url":"/img/designs/png-16.png"});
        designs.insert({"name":"Black Owl", "url":"/img/designs/png-17.png"});
        designs.insert({"name":"Shiba Inu Dog", "url":"/img/designs/png-18.png"});
        designs.insert({"name":"Cute Tiger", "url":"/img/designs/png-19.png"});
        designs.insert({"name":"Awesome since '79", "url":"/img/designs/png-20.png"});
        designs.insert({"name":"Rainbow Popsicle", "url":"/img/designs/png-21.png"});
      }

      var countries_count = countries.find().count();
      if(countries_count < 1) {
        countries.insert({country: "Europe",language:"English"});
        countries.insert({country: "Germany",language:"German"});
        countries.insert({country: "France",language:"French"});
        countries.insert({country: "United Kingdom",language:"English"});
        countries.insert({country: "Belgium (Dutch)",language:"Dutch"});
        countries.insert({country: "Belgium (French)",language:"French"});
        countries.insert({country: "Denmark",language:"Danish"});
        countries.insert({country: "Spain",language:"Spanish"});
        countries.insert({country: "Ireland",language:"English"});
        countries.insert({country: "Italy",language:"Italian"});
        countries.insert({country: "Netherlands",language:"Dutch"});
        countries.insert({country: "Norway",language:"Norwegian"});
        countries.insert({country: "Poland",language:"Polish"});
        countries.insert({country: "Switzerland (German)",language:"German"});
        countries.insert({country: "Switzerland (French)",language:"French"});
        countries.insert({country: "Switzerland (Italian)",language:"Italian"});
        countries.insert({country: "Finland",language:"Finnish"});
        countries.insert({country: "Sweden",language:"Swedish"});
        countries.insert({country: "Austria",language:"German"});
        countries.insert({country: "United States",language:"English"});
        countries.insert({country: "Canada (English)",language:"English"});
        countries.insert({country: "Canada (French)",language:"French"});
        countries.insert({country: "Brazil",language:"Portugese"});
        countries.insert({country: "Australia", language:"English"});
      }

      var colors_count = colors.find().count();
      if(colors_count < 1) {
        colors.insert({name: "light", color: "#FFFFFF"});
        colors.insert({name: "dark", color: "#404040"});
        colors.insert({name: "gray", color: "#B2B2B2"});
        colors.insert({name: "purple", color: "#A67FB2"});
        colors.insert({name: "blue", color: "#5973BF"});
        colors.insert({name: "teal", color: "#66CCCC"});
        colors.insert({name: "green", color: "#4CBF4C"});
        colors.insert({name: "yellow", color: "#FFF266"});
        colors.insert({name: "beige", color: "#E5D9B2"});
        colors.insert({name: "brown", color: "#66594C"});
        colors.insert({name: "orange", color: "#FFA666"});
        colors.insert({name: "red", color: "#D96666"});
        colors.insert({name: "pink", color: "#FFB3BF"});
      }

      return Meteor.methods({

        removeAllProducts: function() {

          return products.remove({});

        },

        removeAllColors: function() {
          return colors.remove({});          
        },

        removeAllDesigns: function() {
          return designs.remove({});          
        },

        removeAllAssets: function() {
          return assets.remove({});          
        }

      });

  });
}