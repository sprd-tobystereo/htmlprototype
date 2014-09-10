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
  Session.set('status_filters_values', []);
  Session.set('status_filters_singleOrMultiValue', []);

  // We are declaring the 'adding_category' flag
  Session.set('adding_asset', false);
  Session.set('editing_asset', '');
  Session.set('selected_assets');
  Session.set('showGLobalTags', false);
  
  Session.set('newAssetPublishedPublished', false);
  Session.set('newAssetIsApproved', false);

  Session.set('assetgridview', true);
  Session.set('zeroStateAddTag', false);
  Session.set('showAssortment', false);
  Session.set('showAssets', false);
  Session.set('showFilters', false);
  Session.set('showDesigns', false);

  Session.set('editing_design', false);
  Session.set('editing_product', '');

  /******************************************

      Template Variables Helper Functions
      
  *******************************************/
  // Template: zeroStateAddTag

  Template.zeroStateAddTag.zeroStateAddTag = function (e,t) {
    return Session.get('zeroStateAddTag');
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
    return assets.find({});
  };

  Template.assets.tags = function () {
    return tags.find({},{sort: {'tag': 1}});
  };

  // This returns true if adding_category has been assigned a value of true
  Template.assets.new_edit_asset = function () {
    return Session.equals('adding_asset', true);
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
  }

  Template.assets.designs = function () {
    return designs.find({}, {sort: {'name': 1}});
  }

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

  // Template.asset.designs = function () {
  //   return (this).designs;
  // }

  Template.asset.design_url = function () {
    var the_id = String(this);
    return designs.findOne({'_id': the_id}).url;
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

  // Template: productFiltersListed

  Template.productFiltersListed.mens = function () {
    return products.find({category: 'Men'}, {sort: {'name': 1}});
  };

  Template.productFiltersListed.womens = function () {
    return products.find({category: 'Women'}, {sort: {'name': 1}});
  };

  Template.productFiltersListed.kids = function () {
    return products.find({category: 'Kids & Babies'}, {sort: {'name': 1}});
  };

  Template.productFiltersListed.accessories = function () {
    return products.find({category: 'Accessories'}, {sort: {'name': 1}});
  };

  Template.productFiltersListed.cases = function () {
    return products.find({category: 'Cases'}, {sort: {'name': 1}});
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
    if((this).category == "Kids &amp; Babies") {
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






  /******************************************

      Template Events Helper Functions
      
  *******************************************/

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
      var the_selector = document.getElementById('product_category');
      var the_category = the_selector.options[the_selector.selectedIndex].value;
      var the_id = document.getElementById('product_id').value;

      products.update({'_id': the_id}, {$set: {
        category: the_category
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
      Meteor.call('removeAllProducts')
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
    }

  });

  // Template: Asset

  Template.asset.events({
    'click .flexigrid-item': function(e,t) {
      Session.set('selected_assets', this._id);
      var the_asset = e.currentTarget;
      var the_id = the_asset.id;
      $('#' + the_id).toggleClass('selected');
    },

    'click .edit_asset_button': function(e,t) {
      Session.set('editing_asset', this._id);
      Session.set('adding_asset', true);
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

}

if (Meteor.isServer) {
  Meteor.startup(function () {

    // code to run on server at startup
      var products_count = products.find().count();
      if(products_count < 1){
          products.insert({
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

products.insert({"name" : "Women’s Premium T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.com/api/v1/countries/94"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/813/views/1/appearances/506"},"id" : "813","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/813"});

products.insert({"name" : "Kid\u0027s Premium T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.com/api/v1/countries/94"},"price" : {"vatExcluded":8.90,"vatIncluded":8.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/815/views/1/appearances/231"},"id" : "815","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/815"});

products.insert({"name" : "Toddler Premium T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.com/api/v1/countries/94"},"price" : {"vatExcluded":8.90,"vatIncluded":8.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/814/views/1/appearances/366"},"id" : "814","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/814"});

products.insert({"name" : "Men’s Premium Tank Top","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.com/api/v1/countries/94"},"price" : {"vatExcluded":12.90,"vatIncluded":12.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/916/views/1/appearances/231"},"id" : "916","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/916"});

products.insert({"name" : "Women’s Premium Tank Top","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.com/api/v1/countries/94"},"price" : {"vatExcluded":12.90,"vatIncluded":12.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/917/views/1/appearances/506"},"id" : "917","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/917"});

products.insert({"name" : "Women\u0027s Hooded Sweatshirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":26.30,"vatIncluded":26.30,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/405/views/2/appearances/196"},"id" : "405","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/405"});

products.insert({"name" : "Men’s Performance T-Shirt","manufacturingCountry" : {"id" : "79","href" : "http://api.spreadshirt.com/api/v1/countries/79"},"price" : {"vatExcluded":14.90,"vatIncluded":14.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/953/views/1/appearances/33"},"id" : "953","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/953"});

products.insert({"name" : "Kids\u0027 Hooded Sweatshirt","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.com/api/v1/countries/124"},"price" : {"vatExcluded":17.90,"vatIncluded":17.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/499/views/2/appearances/370"},"id" : "499","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/499"});

products.insert({"name" : "Unisex Camouflage T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":12.90,"vatIncluded":12.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/922/views/1/appearances/162"},"id" : "922","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/922"});

products.insert({"name" : "Women\u0027s Performance T-Shirt","manufacturingCountry" : {"id" : "79","href" : "http://api.spreadshirt.com/api/v1/countries/79"},"price" : {"vatExcluded":14.90,"vatIncluded":14.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/954/views/1/appearances/412"},"id" : "954","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/954"});

products.insert({"name" : "Tote Bag","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":8.50,"vatIncluded":8.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/842/views/1/appearances/2"},"id" : "842","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/842"});

products.insert({"name" : "Shot Glass","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":3.50,"vatIncluded":3.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/915/views/1/appearances/1"},"id" : "915","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/915"});

products.insert({"name" : "Men\u0027s T-Shirt","manufacturingCountry" : {"id" : "79","href" : "http://api.spreadshirt.com/api/v1/countries/79"},"price" : {"vatExcluded":6.50,"vatIncluded":6.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/210/views/1/appearances/63"},"id" : "210","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/210"});

products.insert({"name" : "Women\u0027s T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":6.50,"vatIncluded":6.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/347/views/1/appearances/164"},"id" : "347","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/347"});

products.insert({"name" : "iPhone 4/4S Premium Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/869/views/1/appearances/1"},"id" : "869","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/869"});

products.insert({"name" : "iPhone 5/5S Premium Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/870/views/1/appearances/1"},"id" : "870","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/870"});

products.insert({"name" : "Samsung Galaxy S3 Premium Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/871/views/1/appearances/1"},"id" : "871","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/871"});

products.insert({"name" : "Samsung Galaxy S4 Premium Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/872/views/1/appearances/1"},"id" : "872","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/872"});

products.insert({"name" : "Samsung Galaxy S5 Premium Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/947/views/1/appearances/1"},"id" : "947","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/947"});

products.insert({"name" : "Women\u0027s Slim Fit T-Shirt by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":14.20,"vatIncluded":14.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/288/views/1/appearances/92"},"id" : "288","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/288"});

products.insert({"name" : "Men\u0027s T-Shirt by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":14.20,"vatIncluded":14.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/175/views/1/appearances/203"},"id" : "175","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/175"});

products.insert({"name" : "Baby T-Romper","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":11.90,"vatIncluded":11.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/820/views/1/appearances/504"},"id" : "820","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/820"});

products.insert({"name" : "Adult Apron","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.com/api/v1/countries/102"},"price" : {"vatExcluded":13.10,"vatIncluded":13.10,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/158/views/1/appearances/360"},"id" : "158","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/158"});

products.insert({"name" : "Leggings by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":17.90,"vatIncluded":17.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/925/views/3/appearances/504"},"id" : "925","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/925"});

products.insert({"name" : "Contrast Coffee Mug","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/268/views/3/appearances/71"},"id" : "268","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/268"});

products.insert({"name" : "iPhone 5/5S Hard Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/782/views/1/appearances/533"},"id" : "782","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/782"});

products.insert({"name" : "iPhone 5C Rubber Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/910/views/1/appearances/70"},"id" : "910","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/910"});

products.insert({"name" : "Women\u0027s Tri-Blend Performance T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":19.50,"vatIncluded":19.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/838/views/1/appearances/228"},"id" : "838","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/838"});

products.insert({"name" : "Men\u0027s Hooded Sweatshirt","manufacturingCountry" : {"id" : "84","href" : "http://api.spreadshirt.com/api/v1/countries/84"},"price" : {"vatExcluded":26.30,"vatIncluded":26.30,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/111/views/2/appearances/22"},"id" : "111","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/111"});

products.insert({"name" : "Men\u0027s Tri-Blend Performance T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":19.50,"vatIncluded":19.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/837/views/1/appearances/519"},"id" : "837","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/837"});

products.insert({"name" : "Snap-back Baseball Cap","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.com/api/v1/countries/94"},"price" : {"vatExcluded":14.90,"vatIncluded":14.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/803/views/1/appearances/548"},"id" : "803","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/803"});

products.insert({"name" : "iPhone 5/5S Rubber Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/822/views/1/appearances/70"},"id" : "822","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/822"});

products.insert({"name" : "Women’s French Terry Zip Hoodie","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.com/api/v1/countries/124"},"price" : {"vatExcluded":37.50,"vatIncluded":37.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/926/views/1/appearances/556"},"id" : "926","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/926"});

products.insert({"name" : "Women’s Cropped Boxy T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":15.50,"vatIncluded":15.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/946/views/1/appearances/2"},"id" : "946","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/946"});

products.insert({"name" : "Shot Glasses (set of 4)","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":11.90,"vatIncluded":11.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/921/views/1/appearances/1"},"id" : "921","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/921"});

products.insert({"name" : "Women\u0027s Tri-Blend Performance Hooded T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":27.50,"vatIncluded":27.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/839/views/1/appearances/519"},"id" : "839","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/839"});

products.insert({"name" : "Frosted Glass Beer Mug","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":12.90,"vatIncluded":12.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/826/views/3/appearances/509"},"id" : "826","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/826"});

products.insert({"name" : "Unisex Fleece Zip Hoodie by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":34.70,"vatIncluded":34.70,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/669/views/2/appearances/448"},"id" : "669","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/669"});

products.insert({"name" : "Baby Long Sleeve One Piece","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.com/api/v1/countries/102"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/342/views/1/appearances/1"},"id" : "342","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/342"});

products.insert({"name" : "Womens Wideneck Sweatshirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":31.80,"vatIncluded":31.80,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/681/views/1/appearances/450"},"id" : "681","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/681"});

products.insert({"name" : "Men\u0027s Long Sleeve T-Shirt by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":18.60,"vatIncluded":18.60,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/174/views/1/appearances/231"},"id" : "174","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/174"});

products.insert({"name" : "Women\u0027s V-Neck T-Shirt","manufacturingCountry" : {"id" : "94","href" : "http://api.spreadshirt.com/api/v1/countries/94"},"price" : {"vatExcluded":12.00,"vatIncluded":12.00,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/348/views/1/appearances/194"},"id" : "348","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/348"});

products.insert({"name" : "Women\u0027s Flowy Tank Top by Bella","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":15.30,"vatIncluded":15.30,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/752/views/1/appearances/412"},"id" : "752","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/752"});

products.insert({"name" : "Coffee/Tea Mug","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":6.90,"vatIncluded":6.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/31/views/1/appearances/1"},"id" : "31","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/31"});

products.insert({"name" : "Women\u0027s Longer Length Fitted Tank","manufacturingCountry" : {"id" : "79","href" : "http://api.spreadshirt.com/api/v1/countries/79"},"price" : {"vatExcluded":12.00,"vatIncluded":12.00,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/469/views/1/appearances/142"},"id" : "469","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/469"});

products.insert({"name" : "Flip-Flops","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":15.50,"vatIncluded":15.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/846/views/1/appearances/70"},"id" : "846","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/846"});

products.insert({"name" : "Samsung Galaxy S5 Rubber Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/948/views/1/appearances/70"},"id" : "948","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/948"});

products.insert({"name" : "Teddy Bear","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":14.90,"vatIncluded":14.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/909/views/1/appearances/1"},"id" : "909","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/909"});


products.insert({"name" : "Travel Mug","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":11.90,"vatIncluded":11.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/773/views/3/appearances/1"},"id" : "773","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/773"});

products.insert({"name" : "Women\u0027s Ringer T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":13.10,"vatIncluded":13.10,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/216/views/1/appearances/70"},"id" : "216","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/216"});

products.insert({"name" : "Umbrella","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":14.20,"vatIncluded":14.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/55/views/1/appearances/5"},"id" : "55","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/55"});

products.insert({"name" : "Women\u0027s Long Sleeve Jersey T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":13.10,"vatIncluded":13.10,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/345/views/1/appearances/18"},"id" : "345","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/345"});

products.insert({"name" : "Blanket","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":25.20,"vatIncluded":25.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/609/views/1/appearances/5"},"id" : "609","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/609"});

products.insert({"name" : "Pillowcase","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":9.90,"vatIncluded":9.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/914/views/1/appearances/1"},"id" : "914","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/914"});

products.insert({"name" : "Men\u0027s Crewneck Sweatshirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":19.70,"vatIncluded":19.70,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/512/views/1/appearances/231"},"id" : "512","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/512"});

products.insert({"name" : "Baseball Cap","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":12.00,"vatIncluded":12.00,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/129/views/1/appearances/5"},"id" : "129","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/129"});

products.insert({"name" : "Toddler Hooded Sweatshirt","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.com/api/v1/countries/124"},"price" : {"vatExcluded":16.20,"vatIncluded":16.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/404/views/2/appearances/194"},"id" : "404","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/404"});

products.insert({"name" : "Men\u0027s Long Sleeve T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":16.40,"vatIncluded":16.40,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/23/views/1/appearances/4"},"id" : "23","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/23"});

products.insert({"name" : "Womens Tri-Blend Long Sleeve T-Shirt","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":15.50,"vatIncluded":15.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/883/views/1/appearances/540"},"id" : "883","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/883"});

products.insert({"name" : "Men\u0027s Muscle T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":14.20,"vatIncluded":14.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/98/views/1/appearances/4"},"id" : "98","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/98"});

products.insert({"name" : "Kids\u0027 Long Sleeve T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":9.80,"vatIncluded":9.80,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/486/views/1/appearances/5"},"id" : "486","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/486"});

products.insert({"name" : "Unisex Tri-Blend T-Shirt by American Apparel","manufacturingCountry" : {"id" : "78","href" : "http://api.spreadshirt.com/api/v1/countries/78"},"price" : {"vatExcluded":16.90,"vatIncluded":16.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/691/views/1/appearances/458"},"id" : "691","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/691"});

products.insert({"name" : "Men\u0027s Bottle Cap Opener T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":13.90,"vatIncluded":13.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/800/views/1/appearances/2"},"id" : "800","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/800"});

products.insert({"name" : "Kid\u0027s Zip Hoodie","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":20.90,"vatIncluded":20.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/677/views/2/appearances/5"},"id" : "677","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/677"});

products.insert({"name" : "Drawstring Bag","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":8.70,"vatIncluded":8.70,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/775/views/1/appearances/349"},"id" : "775","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/775"});

products.insert({"name" : "Men\u0027s V-Neck T-Shirt by Canvas","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":16.40,"vatIncluded":16.40,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/686/views/1/appearances/17"},"id" : "686","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/686"});

products.insert({"name" : "Men’s Contrast Tank Top","manufacturingCountry" : {"id" : "79","href" : "http://api.spreadshirt.com/api/v1/countries/79"},"price" : {"vatExcluded":15.90,"vatIncluded":15.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/865/views/1/appearances/400"},"id" : "865","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/865"});

products.insert({"name" : "Women\u0027s Maternity T-Shirt","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.com/api/v1/countries/102"},"price" : {"vatExcluded":16.40,"vatIncluded":16.40,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/377/views/1/appearances/2"},"id" : "377","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/377"});

products.insert({"name" : "Men’s Baseball T-Shirt","manufacturingCountry" : {"id" : "78","href" : "http://api.spreadshirt.com/api/v1/countries/78"},"price" : {"vatExcluded":19.70,"vatIncluded":19.70,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/951/views/1/appearances/70"},"id" : "951","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/951"});

products.insert({"name" : "Men\u0027s Zip Hoodie","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":27.40,"vatIncluded":27.40,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/198/views/2/appearances/4"},"id" : "198","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/198"});

products.insert({"name" : "iPhone 4/4S Rubber Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/827/views/1/appearances/70"},"id" : "827","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/827"});

products.insert({"name" : "Women\u0027s Zip Hoodie","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.com/api/v1/countries/124"},"price" : {"vatExcluded":27.40,"vatIncluded":27.40,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/197/views/2/appearances/164"},"id" : "197","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/197"});

products.insert({"name" : "Kids\u0027 T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":6.50,"vatIncluded":6.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/48/views/1/appearances/2"},"id" : "48","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/48"});

products.insert({"name" : "Baby Short Sleeve One Piece","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.com/api/v1/countries/102"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/401/views/1/appearances/114"},"id" : "401","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/401"});

products.insert({"name" : "Men\u0027s Organic T-Shirt","manufacturingCountry" : {"id" : "79","href" : "http://api.spreadshirt.com/api/v1/countries/79"},"price" : {"vatExcluded":16.40,"vatIncluded":16.40,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/460/views/1/appearances/2"},"id" : "460","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/460"});

products.insert({"name" : "Women\u0027s Organic T-Shirt","manufacturingCountry" : {"id" : "79","href" : "http://api.spreadshirt.com/api/v1/countries/79"},"price" : {"vatExcluded":15.30,"vatIncluded":15.30,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/461/views/1/appearances/2"},"id" : "461","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/461"});

products.insert({"name" : "iPad 2/3 Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":13.90,"vatIncluded":13.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/783/views/1/appearances/70"},"id" : "783","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/783"});

products.insert({"name" : "Women\u0027s Bamboo Performance Tank by ALO","manufacturingCountry" : {"id" : "134","href" : "http://api.spreadshirt.com/api/v1/countries/134"},"price" : {"vatExcluded":23.70,"vatIncluded":23.70,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/746/views/1/appearances/486"},"id" : "746","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/746"});

products.insert({"name" : "Unisex Tie Dye T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":12.00,"vatIncluded":12.00,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/491/views/1/appearances/253"},"id" : "491","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/491"});

products.insert({"name" : "Men\u0027s Polo Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":13.10,"vatIncluded":13.10,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/110/views/1/appearances/1"},"id" : "110","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/110"});

products.insert({"name" : "Kid’s Organic T-Shirt by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":11.90,"vatIncluded":11.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/928/views/1/appearances/1"},"id" : "928","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/928"});

products.insert({"name" : "Men\u0027s Tall T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":16.40,"vatIncluded":16.40,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/650/views/1/appearances/1"},"id" : "650","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/650"});

products.insert({"name" : "Men\u0027s 3XL/4XL Hooded Sweatshirt","manufacturingCountry" : {"id" : "84","href" : "http://api.spreadshirt.com/api/v1/countries/84"},"price" : {"vatExcluded":30.70,"vatIncluded":30.70,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/679/views/2/appearances/399"},"id" : "679","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/679"});

products.insert({"name" : "Samsung Galaxy S4 Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/858/views/1/appearances/70"},"id" : "858","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/858"});

products.insert({"name" : "iPhone 4/4S Hard Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/776/views/1/appearances/70"},"id" : "776","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/776"});

products.insert({"name" : "Samsung Galaxy S2 Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/784/views/1/appearances/70"},"id" : "784","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/784"});

products.insert({"name" : "Samsung Galaxy S3 Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/785/views/1/appearances/70"},"id" : "785","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/785"});

products.insert({"name" : "Knit Beanie","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":8.90,"vatIncluded":8.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/890/views/1/appearances/469"},"id" : "890","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/890"});

products.insert({"name" : "Bandana","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":6.50,"vatIncluded":6.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/610/views/1/appearances/366"},"id" : "610","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/610"});

products.insert({"name" : "Kids\u0027 Ringer T-Shirt","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/487/views/1/appearances/70"},"id" : "487","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/487"});

products.insert({"name" : "Eco-Friendly Cotton Tote","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.com/api/v1/countries/102"},"price" : {"vatExcluded":9.80,"vatIncluded":9.80,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/378/views/1/appearances/2"},"id" : "378","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/378"});

products.insert({"name" : "Nexus 7 Tablet Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":13.90,"vatIncluded":13.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/852/views/1/appearances/70"},"id" : "852","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/852"});

products.insert({"name" : "Women\u0027s Hip Hugger Underwear","manufacturingCountry" : {"id" : "123","href" : "http://api.spreadshirt.com/api/v1/countries/123"},"price" : {"vatExcluded":8.70,"vatIncluded":8.70,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/160/views/1/appearances/18"},"id" : "160","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/160"});

products.insert({"name" : "Dog Bandana","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.60,"vatIncluded":7.60,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/611/views/1/appearances/367"},"id" : "611","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/611"});

products.insert({"name" : "Women\u0027s Heather Jersey T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/402/views/1/appearances/187"},"id" : "402","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/402"});

products.insert({"name" : "Organic Baby Bib","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.com/api/v1/countries/102"},"price" : {"vatExcluded":6.90,"vatIncluded":6.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/634/views/1/appearances/391"},"id" : "634","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/634"});

products.insert({"name" : "Sports Bra by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":22.90,"vatIncluded":22.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/967/views/1/appearances/129"},"id" : "967","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/967"});

products.insert({"name" : "Women\u0027s Fitness Pants by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":28.50,"vatIncluded":28.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/970/views/3/appearances/129"},"id" : "970","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/970"});

products.insert({"name" : "Baby Lap Shoulder T-Shirt","manufacturingCountry" : {"id" : "102","href" : "http://api.spreadshirt.com/api/v1/countries/102"},"price" : {"vatExcluded":7.60,"vatIncluded":7.60,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/375/views/1/appearances/444"},"id" : "375","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/375"});

products.insert({"name" : "Backpack","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":19.90,"vatIncluded":19.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/873/views/1/appearances/109"},"id" : "873","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/873"});

products.insert({"name" : "Brief Case Messenger Bag","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":20.80,"vatIncluded":20.80,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/723/views/1/appearances/2"},"id" : "723","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/723"});

products.insert({"name" : "Unisex Track Jacket by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":29.20,"vatIncluded":29.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/103/views/2/appearances/2"},"id" : "103","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/103"});

products.insert({"name" : "Large Buttons","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":3.00,"vatIncluded":3.00,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/125/views/1/appearances/1"},"id" : "125","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/125"});

products.insert({"name" : "Small Buttons","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":2.00,"vatIncluded":2.00,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/127/views/1/appearances/1"},"id" : "127","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/127"});

products.insert({"name" : "Medium Buttons","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":2.50,"vatIncluded":2.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/126/views/1/appearances/1"},"id" : "126","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/126"});

products.insert({"name" : "Water Bottle","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":10.90,"vatIncluded":10.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/757/views/3/appearances/37"},"id" : "757","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/757"});

products.insert({"name" : "Men\u0027s Boxer Shorts","manufacturingCountry" : {"id" : "78","href" : "http://api.spreadshirt.com/api/v1/countries/78"},"price" : {"vatExcluded":15.30,"vatIncluded":15.30,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/715/views/1/appearances/348"},"id" : "715","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/715"});

products.insert({"name" : "Women\u0027s Scoop Neck T-Shirt","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":14.20,"vatIncluded":14.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/561/views/1/appearances/393"},"id" : "561","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/561"});

products.insert({"name" : "Men\u0027s Ringer T-Shirt by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":14.90,"vatIncluded":14.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/121/views/1/appearances/70"},"id" : "121","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/121"});

products.insert({"name" : "Duffel Bag","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":17.50,"vatIncluded":17.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/636/views/1/appearances/327"},"id" : "636","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/636"});

products.insert({"name" : "Knit Cap","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":6.50,"vatIncluded":6.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/51/views/1/appearances/5"},"id" : "51","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/51"});

products.insert({"name" : "Knit Cap with Cuff Print","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":6.50,"vatIncluded":6.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/945/views/1/appearances/2"},"id" : "945","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/945"});

products.insert({"name" : "Women’s Deep V-Neck Marble T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":17.50,"vatIncluded":17.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/968/views/1/appearances/568"},"id" : "968","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/968"});

products.insert({"name" : "Women\u0027s String Thong","manufacturingCountry" : {"id" : "71","href" : "http://api.spreadshirt.com/api/v1/countries/71"},"price" : {"vatExcluded":7.60,"vatIncluded":7.60,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/115/views/1/appearances/5"},"id" : "115","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/115"});

products.insert({"name" : "Men’s Raglan Crewneck Sweatshirt","manufacturingCountry" : {"id" : "68","href" : "http://api.spreadshirt.com/api/v1/countries/68"},"price" : {"vatExcluded":30.90,"vatIncluded":30.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/908/views/1/appearances/550"},"id" : "908","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/908"});

products.insert({"name" : "Blackberry Z10 Hard Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/859/views/1/appearances/70"},"id" : "859","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/859"});

products.insert({"name" : "Women\u0027s Sweatpants","manufacturingCountry" : {"id" : "71","href" : "http://api.spreadshirt.com/api/v1/countries/71"},"price" : {"vatExcluded":23.00,"vatIncluded":23.00,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/555/views/1/appearances/164"},"id" : "555","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/555"});

products.insert({"name" : "iPod Touch Hard Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/863/views/1/appearances/70"},"id" : "863","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/863"});

products.insert({"name" : "HTC One X Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":7.90,"vatIncluded":7.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/862/views/1/appearances/70"},"id" : "862","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/862"});

products.insert({"name" : "iPad Mini Hard Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":13.90,"vatIncluded":13.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/861/views/1/appearances/70"},"id" : "861","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/861"});

products.insert({"name" : "Women’s Varsity Hooded Sweatshirt Jacket","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.com/api/v1/countries/124"},"price" : {"vatExcluded":37.50,"vatIncluded":37.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/836/views/1/appearances/341"},"id" : "836","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/836"});

products.insert({"name" : "Men’s Varsity Sweatshirt Jacket","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.com/api/v1/countries/124"},"price" : {"vatExcluded":37.50,"vatIncluded":37.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/835/views/1/appearances/341"},"id" : "835","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/835"});

products.insert({"name" : "Men\u0027s Replica Football Jersey by Augusta","manufacturingCountry" : {"id" : "78","href" : "http://api.spreadshirt.com/api/v1/countries/78"},"price" : {"vatExcluded":22.90,"vatIncluded":22.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/874/views/1/appearances/2"},"id" : "874","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/874"});

products.insert({"name" : "Samsung Galaxy Note 2 Hard Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":13.90,"vatIncluded":13.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/864/views/1/appearances/70"},"id" : "864","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/864"});

products.insert({"name" : "Samsung Note 8.0 Hard Case","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":13.90,"vatIncluded":13.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/860/views/1/appearances/70"},"id" : "860","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/860"});

products.insert({"name" : "Women\u0027s Capri Yoga Pants","manufacturingCountry" : {"id" : "134","href" : "http://api.spreadshirt.com/api/v1/countries/134"},"price" : {"vatExcluded":25.90,"vatIncluded":25.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/749/views/1/appearances/2"},"id" : "749","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/749"});

products.insert({"name" : "Knit Pom Cap","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":9.90,"vatIncluded":9.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/889/views/1/appearances/376"},"id" : "889","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/889"});

products.insert({"name" : "Bath Towel","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":19.99,"vatIncluded":19.99,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/853/views/1/appearances/1"},"id" : "853","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/853"});

products.insert({"name" : "Women\u0027s Fitness Shorts","manufacturingCountry" : {"id" : "134","href" : "http://api.spreadshirt.com/api/v1/countries/134"},"price" : {"vatExcluded":13.50,"vatIncluded":13.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/639/views/1/appearances/2"},"id" : "639","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/639"});

products.insert({"name" : "Men\u0027s Sweatpants","manufacturingCountry" : {"id" : "73","href" : "http://api.spreadshirt.com/api/v1/countries/73"},"price" : {"vatExcluded":25.20,"vatIncluded":25.20,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/671/views/1/appearances/2"},"id" : "671","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/671"});

products.insert({"name" : "Country Scarf","manufacturingCountry" : {"id" : "148","href" : "http://api.spreadshirt.com/api/v1/countries/148"},"price" : {"vatExcluded":12.90,"vatIncluded":12.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/944/views/1/appearances/570"},"id" : "944","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/944"});

products.insert({"name" : "Men’s Basketball Jersey","manufacturingCountry" : {"id" : "78","href" : "http://api.spreadshirt.com/api/v1/countries/78"},"price" : {"vatExcluded":13.50,"vatIncluded":13.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/879/views/1/appearances/54"},"id" : "879","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/879"});

products.insert({"name" : "Kid’s Basketball Jersey","manufacturingCountry" : {"id" : "78","href" : "http://api.spreadshirt.com/api/v1/countries/78"},"price" : {"vatExcluded":9.99,"vatIncluded":9.99,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/880/views/1/appearances/54"},"id" : "880","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/880"});

products.insert({"name" : "Jersey Scarf by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":13.90,"vatIncluded":13.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/593/views/1/appearances/129"},"id" : "593","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/593"});

products.insert({"name" : "Baby Cap by American Apparel","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":6.90,"vatIncluded":6.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/817/views/1/appearances/2"},"id" : "817","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/817"});

products.insert({"name" : "Women\u0027s Pique Polo Shirt","manufacturingCountry" : {"id" : "123","href" : "http://api.spreadshirt.com/api/v1/countries/123"},"price" : {"vatExcluded":21.50,"vatIncluded":21.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/728/views/1/appearances/2"},"id" : "728","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/728"});

products.insert({"name" : "Men\u0027s Baseball T-Shirt","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":19.70,"vatIncluded":19.70,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/102/views/1/appearances/26"},"id" : "102","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/102"});

products.insert({"name" : "Men\u0027s Performance T-Shirt by Champion","manufacturingCountry" : {"id" : "108","href" : "http://api.spreadshirt.com/api/v1/countries/108"},"price" : {"vatExcluded":17.90,"vatIncluded":17.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/698/views/1/appearances/2"},"id" : "698","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/698"});

products.insert({"name" : "Knit Earflap Cap","manufacturingCountry" : {"id" : "98","href" : "http://api.spreadshirt.com/api/v1/countries/98"},"price" : {"vatExcluded":8.50,"vatIncluded":8.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/887/views/1/appearances/2"},"id" : "887","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/887"});

products.insert({"name" : "Women\u0027s Performance T-Shirt by Champion","manufacturingCountry" : {"id" : "108","href" : "http://api.spreadshirt.com/api/v1/countries/108"},"price" : {"vatExcluded":16.50,"vatIncluded":16.50,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/699/views/1/appearances/2"},"id" : "699","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/699"});

products.insert({"name" : "Men\u0027s Zip Hoodie by Dickies","manufacturingCountry" : {"id" : "124","href" : "http://api.spreadshirt.com/api/v1/countries/124"},"price" : {"vatExcluded":48.90,"vatIncluded":48.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/357/views/1/appearances/2"},"id" : "357","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/357"});

products.insert({"name" : "Men\u0027s Performance Shorts","manufacturingCountry" : {"id" : "86","href" : "http://api.spreadshirt.com/api/v1/countries/86"},"price" : {"vatExcluded":16.90,"vatIncluded":16.90,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/750/views/1/appearances/2"},"id" : "750","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/750"});

products.insert({"name" : "Belly band for pregnant women","manufacturingCountry" : {"id" : "137","href" : "http://api.spreadshirt.com/api/v1/countries/137"},"price" : {"vatExcluded":6.79,"vatIncluded":6.79,"vat":0.00,"currency" : {"id" : "3","href" : "http://api.spreadshirt.com/api/v1/currencies/3"}},"resources" : {"mediaType" : "png","type" : "preview","href" : "http://image.spreadshirt.com/image-server/v1/productTypes/753/views/1/appearances/1"},"id" : "753","href" : "http://api.spreadshirt.com/api/v1/shops/10000/productTypes/753"});

      }

      var shop_count = shops.find().count();
      if(shop_count < 1) {
        shops.insert({shop: "English Memes"});
        shops.insert({shop: "Hipsterama"});
      }

      var designs_count = designs.find().count();
      if(designs_count < 1) {
        designs.insert({"name":"I Heart Hawaii", "url":"http://i.imgur.com/n3j44lC.png"});
        designs.insert({"name":"LIKE!", "url":"http://gamesliberty.com/wp-content/uploads/2014/04/like-it1.png"});
        designs.insert({"name":"Love Life!", "url":"http://i.imgur.com/AQlnAiL.png"});
        designs.insert({"name":"Snowflake Glitter", "url":"http://fc04.deviantart.net/fs71/f/2013/048/1/b/glow_snowflake_design_by_julee_san_png_by_jssanda-d5ohheq.png"});
        designs.insert({"name":"Hipster Triangle", "url":"http://cdn1.sbnation.com/images/verge/mobile-apps/promo/verge-android-logo.ve5e8ebf.png"});
        designs.insert({"name":"Tree", "url":"http://gallery.yopriceville.com/downloadfullsize/send/6166.png"});
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

      return Meteor.methods({

        removeAllProducts: function() {

          return products.remove({});

        }

      });

  });
}