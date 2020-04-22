
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('fsys_pay_methods').del()
    .then(function () {
      // Inserts seed entries
      return knex('fsys_pay_methods').insert([
        {
          pay_method: 'money',
          applicable: 'wallet'
        },
        {
          pay_method: 'debit',
          applicable: 'account'
        },
        {
          pay_method: 'credit card',
          applicable: 'credit'
        }
      ]);
    });
};
