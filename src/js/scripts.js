$('#menu-toggle').click(function() {
  $('#container > header nav').toggleClass('open');
});

$('#projects-container').isotope({
  // options
  itemSelector: '.item',
  sortBy: 'original-order',
  masonry: {
    columnWidth: '.grid-sizer'
  }
});

$('#project-filter-buttons > button').click(function() {
  if ($(this).hasClass('active')) return;

  $(this).siblings().removeClass('active');

  var filterClasses = '';
  var classString = $(this).attr('class');

  if (classString) {

    var classes = classString.split(' ');

    classes.forEach(function(val, index) {
      if (!val) return;

      if (index > 0) {
        filterClasses += ' ';
      }

      filterClasses += '.' + val;
    });
  }

  $('#projects-container').isotope({filter: filterClasses});

  $(this).addClass('active');
});
