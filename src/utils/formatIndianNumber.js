function formatIndianNumber(number) {
      if (isNaN(number)) {
        return 'Invalid Number';
      }

      const absoluteNumber = Math.abs(number);
      const formattedNumber = absoluteNumber.toLocaleString('en-IN', { maximumFractionDigits: 2 });
      return `₹${formattedNumber}`;
    }

    export default formatIndianNumber;
