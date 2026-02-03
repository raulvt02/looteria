<?php session_start(); ?>

<?php include __DIR__ . '/../app/includes/header.php'; ?>

<canvas id="particles-bg"></canvas>

<div id="app">
    <?php include __DIR__ . '/../app/includes/navbar.php'; ?>

    <main id="content">
        <?php include __DIR__ . '/../app/pages/home.php'; ?>
    </main>

    <?php include __DIR__ . '/../app/includes/footer.php'; ?>
</div>

