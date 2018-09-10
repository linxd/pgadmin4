import gettext from 'sources/gettext';
import _ from 'underscore';
import pgAdmin from 'sources/pgadmin';

let _toolbarButtons = {};
let _browserPanel = null;

// Default Tool Bar Buttons.
let _defaultToolBarButtons = [
  {
    label: gettext('Filtered Rows'),
    btnClass: 'fa fa-filter',
    text: '',
    toggled: false,
    toggleClass: '',
    parentClass: 'pg-toolbar-btn',
    enabled: false,
  },
  {
    label: gettext('View Data'),
    btnClass: 'fa fa-table',
    text: '',
    toggled: false,
    toggleClass: '',
    parentClass: 'pg-toolbar-btn',
    enabled: false,
  },
  {
    label: gettext('Query Tool'),
    btnClass: 'fa fa-bolt',
    text: '',
    toggled: false,
    toggleClass: '',
    parentClass: 'pg-toolbar-btn',
    enabled: false,
  },
];

// Place holder for non default tool bar buttons.
let _otherToolbarButtons = [];

// This function is used to add button into the browser panel.
function registerToolBarButton(btn) {
  if (!(btn.label in _toolbarButtons)) {
    _browserPanel.addButton(
      btn.label, btn.btnClass, btn.text, btn.label, btn.toggled,
      btn.toggleClass, btn.parentClass, btn.enabled
    );

    _toolbarButtons[btn.label] = btn;
  }
}

// This function is used to add tool bar button and
// listen on the button event.
export function initializeToolbar(panel, wcDocker) {
  _browserPanel = panel;

  // Iterate through default tool bar buttons and add them into the
  // browser panel.
  _.each(_defaultToolBarButtons, (btn) => {
    registerToolBarButton(btn);
  });

  // Iterate through other tool bar buttons and add them into the
  // browser panel.
  _.each(_otherToolbarButtons, (btn) => {
    registerToolBarButton(btn);
  });

  // Listen on button click event.
  panel.on(wcDocker.EVENT.BUTTON, function(data) {
    if ('name' in data && data.name === 'Query Tool')
      pgAdmin.DataGrid.show_query_tool('', pgAdmin.Browser.tree.selected());
    else if ('name' in data && data.name === 'View Data')
      pgAdmin.DataGrid.show_data_grid({mnuid: 1}, pgAdmin.Browser.tree.selected());
    else if ('name' in data && data.name === 'Filtered Rows')
      pgAdmin.DataGrid.show_filtered_row({mnuid: 4}, pgAdmin.Browser.tree.selected());
  });
}

// This function is used to enable/disable the specific button
// based on their label.
export function enable(label, enable) {
  if (label in _toolbarButtons) {
    _browserPanel.buttonEnable(label, enable);
  } else {
    console.warn('Developer warning: No tool button found with label: ' + label);
  }
}
