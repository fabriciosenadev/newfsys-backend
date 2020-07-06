
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('fsys_pay_methods').del()
    .then(function () {
      // Inserts seed entries
      return knex('fsys_pay_methods').insert([
        {
          pay_method: 'Dinheiro',
          applicable: 'wallet'
        },
        {
          pay_method: 'Débito',
          applicable: 'account'
        },
        {
          pay_method: 'Cartão de crédito',
          applicable: 'credit'
        }
      ]);
    });
};
