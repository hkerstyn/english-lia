    'options' can have the following forms:

      options = {
        texts: ["some", "descriptions"]
      }
        in this case, the texts represent both the descriptions
        as well as the values of the radio options

      options = {
        texts: ["Spanish", "German"],
        values: ["es", "de"]
      }
        here, the texts and the values are different

      options = {
        objects: [{a: 4, b: 2}, {a: 2, b: 8}],
        textFunction: function (object) {
          return "Point (" + object.a + "," + object.b + ")";
        }
        valueFunction: function (object) {
          return [a, b];
        }
          the result here would be texts "Point(4,2)" and "Point(2,8)"
          and values [4,2] and [2,8]
          (for example)
      }

