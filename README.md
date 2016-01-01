
OGNext-Userscript
===============

Getting started
---------------

OGNext mainly consists of two parts. You are currently looking at the client part.
The userscript has been tested with:

- Firefox + Greasemonkey (fully tested)
- Chrome + Tampermonkey (partly tested)

Build, run and deploy
---------------------

Either clone the repository, checkout the develop tree and add the script to Greasemonkey/Tampermonkey or simply copy the script into the add-on.

Open your OGame account and look for the box saying `OGNext Settings` (should be right under `Shop`). Fill in the server details in the **OGNext Instance URL** input box. If you're running a local server with default settings, the path should be:

    http://localhost:8080/OGNext-*

Where `*` is the current version.
You can find the current version at the top left of the [welcome page](http://localhost:8080), for example:

    App version: 0.2-SNAPSHOT

In this example the value of the OGNext Instance URL should be:

    http://localhost:8080/OGNext-0.2-SNAPSHOT

How to contribute
-----------------

This is a rapidly changing work in progress. That means pull requests are in danger of becoming obsolete before they arrive.

Find us in the [OGNext chat](http://chat.stackexchange.com/rooms/30740/ognext-next-level-personal-ogame-assistant) or open a ticket for feature requests.
