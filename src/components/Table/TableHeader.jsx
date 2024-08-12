// This is analog of table from teaching booking, but using table
import React from 'react';

import tableStyles from './TableTeaching.module.scss';
import classNames from 'classnames';
import {Tooltip} from 'react-tooltip';

export default function TableHeader({juries, projects, criterias}) {
  const outerOrInnerCell = index => {
    return index === projects.length - 1 ? tableStyles.cell__outer : tableStyles.cell__inner;
  };
  return (
    <>
      {juries && projects && criterias && (
        <tr key={'header'} className={tableStyles.tr__header}>
          <td>
            <div
              className={classNames(
                tableStyles.cell,
                tableStyles.cell__outer,
                tableStyles.cell__mySubgroup
              )}>
              Ім'я
            </div>
          </td>
          <td>
            <div
              className={classNames(
                tableStyles.cell,

                outerOrInnerCell(0)
              )}>
              Лінки
            </div>
          </td>
          <td>
            <div
              className={classNames(
                tableStyles.cell,

                outerOrInnerCell(0)
              )}>
              Файли
            </div>
          </td>
          <td>
            <div
              className={classNames(
                tableStyles.cell,
                tableStyles.cell__big,
                outerOrInnerCell(0)
              )}>
              Відео/опис
            </div>
          </td>
          <td>
            <div
              className={classNames(tableStyles.cell, tableStyles.cell__big, outerOrInnerCell(0))}>
              Коментар ментора
            </div>
          </td>
          {criterias.map(criteria => (
            <>
              <td colSpan={juries.length + 1}>
                <div className={classNames(tableStyles.cell, outerOrInnerCell(0))}>
                  {criteria.name}
                  <div className={tableStyles.cell__subCell}>
                    {juries.map(jure => (
                      <div
                        className={tableStyles.cell__subCell__item}
                        key={`${criteria._id}-${jure.jureId}`}
                        data-tooltip-id={`${criteria._id}-${jure.jureId}`}
                        data-tooltip-content={jure.name}>
                        {(() => {
                          const fullName = jure.name.split(' ');
                          if (fullName.length > 1) return `${fullName[0][0]}.${fullName[1][0]}`;
                          return jure.name;
                        })()}
                        <Tooltip id={`${criteria._id}-${jure.jureId}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </td>
              <td colSpan={juries.length + 1}>
                <div
                  className={classNames(
                    tableStyles.cell,
                    tableStyles.cell__avg,
                    outerOrInnerCell(0)
                  )}>
                  Avg
                </div>
              </td>
            </>
          ))}
          <td>
            <div
              className={classNames(
                tableStyles.cell,

                outerOrInnerCell(0)
              )}>
              Усього
            </div>
          </td>
          <td>
            <div
              className={classNames(
                tableStyles.cell,

                outerOrInnerCell(0)
              )}>
              Місце
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
