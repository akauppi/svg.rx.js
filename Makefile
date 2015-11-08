#
# Makefile
#
# Fetch the dependencies for the demos and prepare an online demo setup using 'gh-pages' branch.
#
# Requires:
#		gnu Make
#		npm
#       bower
#
# Note:
#       'bower' could be fetched as a local npm module, as well. We've opted for asking it to be globally installed
#       since it starts to be quite a common tool. AKa081115
#

#---
# Global tools
#
# Note: These targets need to be placed after a '|', when being used as dependencies, to avoid
#				them being re-installed every time.
#
npm=$(shell which npm)
bower=$(shell which bower)

#---
# Build tools
#
gh_pages=node_modules/.bin/gh-pages

#REMOVE if 4.0.6 is fixed
#
#rx-lite-version=4.0.0
#
#libs=lib/svg.min.js lib/rx.lite-$(rx-lite-version).js

demo_lib=demo/lib

libs=$(demo_lib)/svg.min.js $(demo_lib)/rx.lite.min.js

#---
all: libs

help:
	@echo ""
	@echo "make [libs]     # fetch dependencies"
	@echo "make update     # update versions of dependencies"
	@echo "make gh-pages   # publish the demos online"
	@echo ""

# Fetch demo dependencies via bower and npm
#
libs: $(demo_libs)

# Update the libraries in 'demo/lib/' to latest available versions - this is only done manually.
#
update: | $(npm) $(bower)
	$(bower) update
	$(npm) -v update rx-lite
	$(MAKE) libs

# The 'gh-pages' plugin pushes a folder into the 'gh-pages' branch so it will be viewable online.
#
# Note: this wipes away any earlier content of 'gh-pages' branch.
#
# PLEASE do not use this unnecessarily. Only for project maintainers!
#
gh-pages: $(gh_pages)
	$(gh_pages) -d demo

clean:
	-rm $(demo_lib)/*

# To be used in release testing. Clears the slate like it was a fresh clone.
#
wipe: clean
	rm -rf ./node_modules ./bower_components

#---
# Updating libs
#
# Note: it is important the libs end up in the version control, so that 'gh-pages' branch
#				has them. I.e. we shouldn't reference the files directly from 'bower_components'
#				and 'node_modules' - those are simply delivery details.
#

#- -
#svgjs=bower_components/svg.js/dist/svg.js
#
#lib/svg.js: $(svgjs)
#	cp $< $@
#
#$(svgjs): | $(bower)
#	$(bower) install svg.js
#	@test -f $@ || (echo "ERROR: couldn't create $@"; false)

svgjs_min=bower_components/svg.js/dist/svg.min.js

$(svgjs_min): | $(bower)
	$(bower) install svg.js
	@test -f $@ || (echo "ERROR: couldn't create $@"; false)

$(demo_lib)/svg.min.js: $(svgjs_min)
	cp $< $@

#- -
# Note: bower does not have 'rx.lite' but npm has
#  

# REMOVE if 4.0.6 works
## NOTE: rx-lite 4.0.1 is broken ('fromEvent' does not fire events)
##
#rxlite=node_modules/rx-lite/rx.lite.js
#
#lib/rx.lite-$(rx-lite-version).js: $(rxlite)
#	cp $< $@
#
#$(rxlite): | $(npm)
#	$(npm) install rx-lite@$(rx-lite-version)
#	@test -f $@ || (echo "ERROR: couldn't create $@"; false)

rxlite_min=node_modules/rx-lite/rx.lite.min.js

$(rxlite_min): | $(npm)
	$(npm) install rx-lite
	@test -f $@ || (echo "ERROR: couldn't create $@"; false)

$(demo_lib)/rx.lite.min.js: $(rxlite_min)
	cp $< $@
	cp $(<:.min.js=.map) $(demo_lib)/

#---
# Global tools
#
ifeq ($(npm),)
$(error ERROR: No 'npm', please install Node.js (e.g. 'brew install node') https://nodejs.org/en/)
endif

ifeq ($(bower),)
$(error ERROR: No 'bower', please install with 'npm install bower -g') http://bower.io)
endif

$(bower): | $(npm)

#---
echo: | $(npm)
	@echo $(npm)

#--	
.PHONY: help libs update echo
