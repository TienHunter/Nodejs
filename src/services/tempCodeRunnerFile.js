include: [
                  { model: db.Allcode, as: 'timeData', attributes: ['valueEn', 'valueVi'] },
                  { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
               ],