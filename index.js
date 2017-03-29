'use strict';

const Alexa = require('alexa-sdk');
const CarbCounter = require('carb-counter');

const APP_ID = 'amzn1.ask.skill.1d3725fd-effd-4d05-a27c-081655dda66f';

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.resources = LANGUAGE_STRINGS;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_REPROMPT');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AddGramsOfCarbs': function () {
        const userId = this.event.session.user.userId;
        const gramsOfCarbs = this.event.request.intent.slots.GramsOfCarbs.value;
        const date = this.event.request.intent.slots.Date.value || this.event.request.timestamp.slice(0, 10);

        if (isNaN(gramsOfCarbs)) {
            const speechOutput = this.t('HELP_MESSAGE');
            const reprompt = this.t('HELP_REPROMPT');
            this.emit(':ask', speechOutput, reprompt);
        } else {
            (function write(index) {CarbCounter.updateGramsOfCarbs(userId, date, gramsOfCarbs, function(err, result) {
                const cardTitle = index.t("ADD_CARBS_CARD_TITLE", index.t("SKILL_NAME"), gramsOfCarbs);
                const speechOutput = index.t('ADD_CARBS_MESSAGE', gramsOfCarbs);

                index.emit(':tellWithCard', speechOutput, cardTitle);
            })})(this);
        }
    },
    'HowManyCarbs': function () {
        const userId = this.event.session.user.userId;
        const date = this.event.request.intent.slots.Date.value || this.event.request.timestamp.slice(0, 10);


        (function read(index) {CarbCounter.readGramsOfCarbs(userId, date, function(err, result) {
            var gramsOfCarbs = 0;
            if (result && result.Item && result.Item.gramsOfCarbs) {
                gramsOfCarbs = result.Item.gramsOfCarbs.N;
            }

            const cardTitle = index.t("HOW_MANY_CARBS_TODAY_CARD_TITLE", index.t("SKILL_NAME"), gramsOfCarbs);
            const speechOutput = index.t('HOW_MANY_CARBS_TODAY_MESSAGE', gramsOfCarbs);

            index.emit(':tellWithCard', speechOutput, cardTitle);
        })})(this);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_REPROMPT');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

const LANGUAGE_STRINGS = {
    'en-US': {
        translation: {
            SKILL_NAME: 'Carb Counter',
            WELCOME_MESSAGE: 'Welcome to %s, %s',
            HELP_MESSAGE: 'You can say add twenty grams of carbs, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
            ADD_CARBS_MESSAGE: "I\'ve added %s grams of carbs to your log",
            ADD_CARBS_CARD_TITLE: "%s - %s grams added",
            HOW_MANY_CARBS_TODAY_MESSAGE: "You've eaten %s grams of carbs today",
            HOW_MANY_CARBS_TODAY_CARD_TITLE: "%s - %s grams eaten today"
        },
    },
};