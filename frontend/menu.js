document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#f0f0f0';
            item.style.transform = 'scale(1.02)';
            item.style.transition = 'all 0.3s ease';
        });
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = '';
            item.style.transform = 'scale(1)';
        });
    });
});