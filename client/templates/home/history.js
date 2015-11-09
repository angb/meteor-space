Template.freeSpacesHistory.helpers({
  freeSpaceHistory: function() {
    return SpaceStatusData.find({}, {sort: {date: -1}, limit: 10});
  }
});
