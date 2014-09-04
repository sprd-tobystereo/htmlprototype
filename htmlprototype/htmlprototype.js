/******************************************

      Collections (Data Objects)

  *******************************************/
assets = new Meteor.Collection("Assets"); // Designs
// designs.insert({name: "I Heart", url: "http://image10.spreadshirt.net/image-server/v1/compositions/5617609/views/1,width=235,height=235,appearanceId=1/Weiss-I-Heart-T-Shirt.jpg", description: "Ich und mein Herz, uns trennt niemand!", tags: ["love", "Liebe", "Herz", "heart"], format: "vector"});
tags = new Meteor.Collection("Tags");
countries = new Meteor.Collection("Countries");


if (Meteor.isClient) {
  // add all client-facing behavior here

  /******************************************

      Session Variables

  *******************************************/

  // We are declaring the 'adding_category' flag
  Session.set('adding_category', false);
  Session.set('editing_tag_id');
  Session.set('new_tag', false);
  Session.set('tag_filters');
  Session.set('status_filters_labels', []);
  Session.set('status_filters_values', []);
  // We are declaring the 'adding_category' flag
  Session.set('adding_asset', false);
  Session.set('editing_asset', '');
  Session.set('selected_assets');
  Session.set('showGLobalTags', false);
  Session.set('newAssetPublishedPublished', false);
  Session.set('assetgridview', true);
  Session.set('zeroStateAddTag', false);

  /******************************************

      Template Variables Helper Functions
      
  *******************************************/
  Template.zeroStateAddTag.zeroStateAddTag = function (e,t) {
    return Session.get('zeroStateAddTag');
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

  Template.assets.countries = function() {
    return countries.find({});
  };

  Template.assets.newAssetId = function () {
    var searchvalue = Session.get('editing_asset');
    console.log(searchvalue);
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
    console.log(assets.findOne({'_id': searchvalue}));
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
      if(assets.findOne({'_id': searchvalue}).review == 'reviewed approved')
      return "checked";
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

  Template.assets.newAssetPublishedCountries = function () {
    var searchvalue = Session.get('editing_asset');
    var existing_countries = assets.findOne({'_id': searchvalue}).publishedcountries;
    for(i=0;i<existing_countries.length;i++){
      if(this._id == existing_countries[i]) {
        return "checked";
      }
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

  Template.asset.assetnotfilteredbystatus = function () {
    var the_labels = Session.get('status_filters_labels');
    var the_values = Session.get('status_filters_values');


    var match = 0;

    if(the_labels.length >= 0){
      for(i=0;i<the_labels.length;i++){
        if(typeof the_labels[i] == 'undefined') {
          the_labels.splice(i, 1); 
          the_values.splice(i, 1); 
          Session.set('status_filters_labels', the_labels);
          Session.set('status_filters_values', the_values);
        }
        if(this[the_labels[i]] == the_values[i]) {
          match++;
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

    
  }

  Template.asset.id = function () {
    return this.id;
  };

  Template.asset.assetgridview = function () {
    return Session.get('assetgridview');
  }

  Template.assets.assetgridview = function () {
    return Session.get('assetgridview');
  }

  // Template: AssetFilterTags

  Template.assetFiltersTags.assetFiltersTags = function () {
    return tags.find({}, {sort: {'tag': 1}});
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
      console.log("delete");
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
      console.log(Session.get('tag_filters'));
    }
  });

  // Template: AssetFilterStatuses

  Template.assetFiltersStatuses.events({
    'click .assetFiltersTag': function (e,t) {
      Meteor.flush();
      var thisFilterIsChecked = e.currentTarget.checked;
      
      var t = Session.get('status_filters_labels');
      var u = Session.get('status_filters_values');
      t = _.extend([], t);
      u = _.extend([], u);
      
      if(thisFilterIsChecked) {
        var the_label = e.currentTarget.getAttribute('data-label');
        var the_value = e.currentTarget.getAttribute('data-value');
        t.push(the_label);
        u.push(the_value);
      } else {
        var t_index = t.indexOf(the_label);
        t.splice(t_index, 1); 
        u.splice(t_index, 1);   
      }
      Session.set('status_filters_labels', t);
      Session.set('status_filters_values', u);
      
      console.log(Session.get('status_filters_labels'));
      console.log(Session.get('status_filters_values'));
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

      var newAssetPublishedCountries = [];
      var allCountries = document.getElementsByClassName('newAssetPublishedCountry');
      for (var i = allCountries.length - 1; i >= 0; i--) {
        if(allCountries[i].checked) {
          var the_country = allCountries[i].getAttribute('value');
          newAssetPublishedCountries.push(the_country);
        }
      };

      var newAssetFileFormat = $('input[name="newAssetFileFormat"]:checked').val();
      var newAssetUsage = $('input[name="newAssetUsage"]:checked').val();
      var newAssetPublished = $('input[name="newAssetPublished"]:checked').val();
      var newAssetReview = $('input[name="newAssetReview"]:checked').val();

      if(newAssetId != '') {
        assets.update({'_id': newAssetId}, {$set: {
          name: newAssetName,
          url: newAssetUrl,
          description: newAssetDescription,
          appliedtags: newAssetTags,
          fileformat: newAssetFileFormat,
          usage: newAssetUsage,
          published: newAssetPublished,
          publishedcountries: newAssetPublishedCountries,
          review: newAssetReview
        }});
        
      } else {
        assets.insert({
          name: newAssetName,
          url: newAssetUrl,
          description: newAssetDescription,
          appliedtags: newAssetTags,
          fileformat: newAssetFileFormat,
          usage: newAssetUsage,
          published: newAssetPublished,
          publishedcountries: newAssetPublishedCountries,
          review: newAssetReview
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
  }
  
  function removeActiveClassFromNavItems() {
    // resets classes on nav items to the default "nav_item" and thus removes all "active" classes
    var nav_items = document.getElementsByClassName('nav_item');      
    for(i=0;i<nav_items.length; i++) {
      nav_items[i].className = "nav_item";
    }
  } 
  
  //this function puts our cursor where it needs to be.
  function focusText(i) {
    i.focus();
    i.select();
  };

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}