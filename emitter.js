'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

/**
 * Создать пространство имен событий
 * @param {String} event - Событие
 * @returns {String}
 */
function createNamespace(event) {

    return event + '.';
}

/**
 * Получить события из пространства имен
 * @param {String} event - Событие
 * @returns {Array}
 */
function getEventsNames(event) {
    let eventsNames = [];
    let splitedEvents = event.split('.');
    splitedEvents.pop();
    let ev = splitedEvents[0] + '.';
    eventsNames.push(ev);
    for (let i = 1; i < splitedEvents.length; i++) {
        ev += splitedEvents[i] + '.';
        eventsNames.push(ev);
    }

    return eventsNames;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let subscriptions = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            subscriptions.push({
                eventName: createNamespace(event),
                context: context,
                handler: handler
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            let eventNamespace = createNamespace(event);
            subscriptions = subscriptions.filter(subscription => (
                !(subscription.eventName.startsWith(eventNamespace)) ||
                (context !== subscription.context)
            ));

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let eventName = createNamespace(event);
            let eventsNames = getEventsNames(eventName);
            subscriptions.filter(subscription => eventsNames
                .includes(subscription.eventName))
                .sort((sub1, sub2) => (sub2.eventName.length - sub1.eventName.length))
                .forEach(subscription => subscription.handler.call(subscription.context));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
            if (times <= 0) {
                this.on(event, context, handler);

                return this;
            }
            let counter = 0;
            this.on(event, context, () => {
                if (counter < times) {
                    counter++;
                    handler.call(context);
                }
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            if (frequency <= 0) {
                this.on(event, context, handler);

                return this;
            }
            let counter = 0;
            this.on(event, context, () => {
                if (counter % frequency === 0) {
                    handler.call(context);
                }
                counter++;

                return this;
            });
        }
    };
}
