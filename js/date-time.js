// -----------Data-attributes:---------------

// [data-type]: 'date' or 'time'   (*date-time is default)
//    date-time ---  dd.mm.yyyy, hh:mm:ss (24h format)
//    date ---       dd.mm.yyyy
//    time ---       hh:mm:ss (24h format)
//------------------------------------------------
// [data-options]: 'KEY:VALUE,KEY:VALUE,KEY:VALUE.....'

//    VALUE - (*numeric is default)
//    month:long,year:numeric = декабрь 2020 г.
//    month,year = 12.2020
//    month = 12
//------------------------------------------------
// All info about options and locales:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
//------------------------------------------------
// [data-locale]: 'ru' is default
//------------------------------------------------
// [data-difference]:
//        - positive values to add to current date
//        - negative values to subtract from current date

// ---------- USE: -------------
// HTML -> <tag class="s-date"></tag>
// JS ->   new DateTime(element).setTextDate();


class DateTime {
  constructor(element) {
    this.element = element;
    this.attributes = { ...this.extractDataAttributes() }
  }

  static defaults() {
    return {
      options: {},
      type: '',
      locale: 'ru'
    }
  }

  setTextDate() {
    const date = this.getDate();
    const { options, type, locale } = this.attributes;

    this.element.textContent = date[`toLocale${type}String`](
        locale,
        options
    );
  }

  getDate() {
    const date = new Date();
    const difference = this.attributes.difference;
    // Set date days later or earlier than now.
    date.setDate(
        date.getDate() + difference
    );

    return date;
  }

  getOptions() {
    const dataOptions = this.element.getAttribute('data-options');
    if (!dataOptions) {
      return DateTime.defaults().options;
    }
    // Separate options with ','
    const optionsArray = dataOptions.split(',');
    const options = {};
    // Separate keys with ':'
    optionsArray.forEach((el) => {
      const option = el.split(':');
      const key = option[0];
      // Default is 'numeric'.
      const value = option[1] || 'numeric';

      options[key] = value;
    })

    return options;
  }

  formatType() {
    let type = this.element.getAttribute('data-type');

    if (type) {
      type = type.toLowerCase();
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }

  extractDataAttributes() {
    return {
      options: this.getOptions(),
      difference: parseInt(this.element.getAttribute('data-difference'), 10) || 0,
      type: this.formatType() || DateTime.defaults().type,
      locale: this.element.getAttribute('data-locale') || DateTime.defaults().locale,
    };
  }
}


document.querySelectorAll('.s-date').forEach((dateElement) => {
  new DateTime(dateElement).setTextDate();
});
