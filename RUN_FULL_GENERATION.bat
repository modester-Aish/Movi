@echo off
echo ============================================
echo Generating ALL 95,942 Movies Sitemap
echo ============================================
echo.
echo Batch Size: 1,000 movies per batch
echo Total Batches: ~96 batches
echo Estimated Time: 1-2 hours
echo.
echo Progress will be shown below...
echo ============================================
echo.

node scripts/generate-exact-sitemaps.js

echo.
echo ============================================
echo Generation Complete!
echo Check: public/sitemaps-real/
echo ============================================
pause


